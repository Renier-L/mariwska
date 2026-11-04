const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add role visibility check before the toast banner
const targetMarker = "{/* Floating Instant Push Notification Toast Banner */}";
const helperCode = `// Farm staff announcements are private directives to farmers (mobile app).
  // Hide completely from Super Admin and Admin notification alerts & popups!
  const isFarmStaffPrivateDirective = 
    activePushNotice && (
      activePushNotice.targetAudience === 'farmers' ||
      (activePushNotice.audienceLabel && activePushNotice.audienceLabel.toLowerCase().includes('farmers only')) ||
      (activePushNotice.author && activePushNotice.author.toLowerCase().includes('farm staff')) ||
      (activePushNotice.title && activePushNotice.title.toLowerCase().includes('farmer field activity'))
    );

  const shouldShowPushToCurrentRole = 
    activePushNotice && 
    (!isFarmStaffPrivateDirective || (currentRole !== 'super_admin' && currentRole !== 'admin'));

  {/* Floating Instant Push Notification Toast Banner */}`;

if (!code.includes('shouldShowPushToCurrentRole') && code.includes(targetMarker)) {
  code = code.replace(targetMarker, helperCode);
  console.log('✓ Added shouldShowPushToCurrentRole helper');
}

// 2. Wrap toast banner with shouldShowPushToCurrentRole
code = code.replace(
  "{/* Floating Instant Push Notification Toast Banner */}\r\n  {activePushNotice && (",
  "{/* Floating Instant Push Notification Toast Banner */}\r\n  {shouldShowPushToCurrentRole && ("
);
code = code.replace(
  "{/* Floating Instant Push Notification Toast Banner */}\n  {activePushNotice && (",
  "{/* Floating Instant Push Notification Toast Banner */}\n  {shouldShowPushToCurrentRole && ("
);

// 3. Wrap popup modal with shouldShowPushToCurrentRole
code = code.replace(
  "{/* POP-UP ANNOUNCEMENT MODAL */}\r\n  {(showFullNoticeModal || (activePushNotice && activePushNotice._autoOpenModal)) && (",
  "{/* POP-UP ANNOUNCEMENT MODAL */}\r\n  {shouldShowPushToCurrentRole && (showFullNoticeModal || (activePushNotice && activePushNotice._autoOpenModal)) && ("
);
code = code.replace(
  "{/* POP-UP ANNOUNCEMENT MODAL */}\n  {(showFullNoticeModal || (activePushNotice && activePushNotice._autoOpenModal)) && (",
  "{/* POP-UP ANNOUNCEMENT MODAL */}\n  {shouldShowPushToCurrentRole && (showFullNoticeModal || (activePushNotice && activePushNotice._autoOpenModal)) && ("
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Finished updating App.jsx for role-based announcement privacy');
