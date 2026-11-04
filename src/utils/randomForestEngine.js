/**
 * Random Forest Prediction Engine for MARIKHA Crop Yield
 * Loaded directly from trained Random Forest model (src/data/models/crop_yield.joblib)
 *
 * Training Dataset: train_crop_yield.csv (Antipolo / MARIKHA Cooperative)
 * Estimators: 100 decision trees
 * Target: actual_yield_kg
 * Predictors: crop, area_m2, soil_type, soil_ph, drainage, season, temp_c, rainfall_mm_month
 */

let cachedModel = null;
let modelLoadingPromise = null;

export const loadCropYieldModel = async () => {
  if (cachedModel) return cachedModel;
  if (!modelLoadingPromise) {
    modelLoadingPromise = import('../data/models/crop_yield_model.json')
      .then(module => {
        cachedModel = module.default || module;
        return cachedModel;
      })
      .catch(err => {
        console.error('Failed to load Random Forest model:', err);
        throw err;
      });
  }
  return modelLoadingPromise;
};

export const predictCropYield = async (input) => {
  const model = await loadCropYieldModel();

  // Extract / sanitize numerical features with fallback to model medians
  // Medians from training dataset: [area_m2: 508.0, soil_ph: 6.41, temp_c: 28.0, rainfall_mm_month: 135.1]
  const medians = model.imputer_num_medians || [508.0, 6.41, 28.0, 135.1];
  
  let area_m2 = Number(input.area_m2 || input.cultivatedArea);
  if (!area_m2 || isNaN(area_m2) || area_m2 <= 0) {
    // If plants are given, approximate standard area (1 plant approx 0.8-1 m2)
    const plants = Number(input.actualPlantedCount || input.plannedPlantingCount);
    area_m2 = plants > 0 ? plants : medians[0];
  }

  // Derive season if not explicitly passed
  let season = input.season;
  if (!season) {
    const month = input.plantingDate ? new Date(input.plantingDate).getMonth() + 1 : new Date().getMonth() + 1;
    // Wet season in the Philippines: June (6) to November (11)
    season = (month >= 6 && month <= 11) ? 'Wet' : 'Dry';
  }

  // Environmental presets based on standard Antipolo / MARIKHA organic conditions
  const soil_ph = Number(input.soil_ph) || medians[1];
  const temp_c = Number(input.temp_c) || (season === 'Wet' ? 27.5 : 29.5);
  const rainfall_mm_month = Number(input.rainfall_mm_month) || (season === 'Wet' ? 180.0 : 75.0);

  // Normalize categorical variables
  const rawCrop = String(input.cropType || input.crop || 'Tomato').toLowerCase();
  const rawSoil = String(input.soil_type || input.soilType || 'Loam').toLowerCase();
  const rawDrainage = String(input.drainage || 'Good').toLowerCase();
  const rawSeason = String(season).toLowerCase();

  // Construct 16-feature one-hot encoded vector matching model.feature_names:
  // 0: num__area_m2
  // 1: num__soil_ph
  // 2: num__temp_c
  // 3: num__rainfall_mm_month
  // 4: cat__crop_Eggplant
  // 5: cat__crop_Okra
  // 6: cat__crop_Squash
  // 7: cat__crop_Tomato
  // 8: cat__soil_type_Clay
  // 9: cat__soil_type_Loam
  // 10: cat__soil_type_Sandy loam
  // 11: cat__drainage_Good
  // 12: cat__drainage_Moderate
  // 13: cat__drainage_Poor
  // 14: cat__season_Dry
  // 15: cat__season_Wet
  const vec = [
    area_m2,
    soil_ph,
    temp_c,
    rainfall_mm_month,
    rawCrop.includes('eggplant') ? 1 : 0,
    rawCrop.includes('okra') ? 1 : 0,
    rawCrop.includes('squash') ? 1 : 0,
    // Default to tomato if crop is Tomato or other vegetable
    (!rawCrop.includes('eggplant') && !rawCrop.includes('okra') && !rawCrop.includes('squash')) ? 1 : 0,
    rawSoil.includes('clay') ? 1 : 0,
    rawSoil === 'loam' ? 1 : 0,
    rawSoil.includes('sandy') ? 1 : 0,
    rawDrainage.includes('good') ? 1 : 0,
    rawDrainage.includes('mod') ? 1 : 0,
    rawDrainage.includes('poor') ? 1 : 0,
    rawSeason.includes('dry') ? 1 : 0,
    rawSeason.includes('wet') ? 1 : 0
  ];

  // Evaluate 100 decision trees
  const offsets = model.tree_offsets;
  const l = model.l;
  const r = model.r;
  const f = model.f;
  const t = model.t;
  const v = model.v;
  const n = offsets.length;
  let totalYield = 0;

  for (let i = 0; i < n; i++) {
    const start = offsets[i];
    let curr = start;
    while (l[curr] !== -1) {
      const featIdx = f[curr];
      const threshold = t[curr];
      if (vec[featIdx] <= threshold) {
        curr = start + l[curr];
      } else {
        curr = start + r[curr];
      }
    }
    totalYield += v[curr];
  }

  // Mean prediction across all estimators
  const predictedKg = Math.round(totalYield / n);

  return {
    predictedKg,
    rawPredictedKg: Math.round((totalYield / n) * 100) / 100,
    featureVector: {
      area_m2,
      soil_ph,
      temp_c,
      rainfall_mm_month,
      season,
      soil_type: rawSoil.includes('clay') ? 'Clay' : (rawSoil.includes('sandy') ? 'Sandy loam' : 'Loam'),
      drainage: rawDrainage.includes('poor') ? 'Poor' : (rawDrainage.includes('mod') ? 'Moderate' : 'Good'),
      crop: rawCrop.includes('eggplant') ? 'Eggplant' : (rawCrop.includes('okra') ? 'Okra' : (rawCrop.includes('squash') ? 'Squash' : 'Tomato'))
    },
    modelMeta: {
      modelName: model.model_name,
      nEstimators: model.n_estimators,
      algorithm: 'Random Forest Regressor (sklearn pipeline)'
    }
  };
};
