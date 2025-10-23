# Privacy Risk Analysis - FormBase

## Overview
FormBase is a mobile data collection application that collects and stores various types of user data. This document outlines the privacy risks associated with data collection and storage.

## Data Collection & Storage

### 1. **Text Data Collection**
**Risk Level**: MEDIUM

**Data Collected**:
- Text field entries (single line)
- Multiline text entries (paragraphs)
- Multiple choice selections

**Privacy Concerns**:
- Users may inadvertently enter sensitive personal information
- No encryption at rest on the server
- Data stored indefinitely on remote server

**Mitigation Measures**:
- Users should be warned not to enter passwords, credit card numbers, or highly sensitive information
- All data transmitted over HTTPS (encrypted in transit)
- Access controlled via JWT authentication
- Data scoped to individual usernames (no cross-user access)

**Recommendations**:
- Implement field-level warnings for sensitive data types
- Add data retention policy (e.g., auto-delete after 1 year)
- Consider end-to-end encryption for sensitive fields

---

### 2. **Location Data (GPS Coordinates)**
**Risk Level**: HIGH

**Data Collected**:
- Precise GPS coordinates (latitude/longitude)
- Captured via device location services

**Privacy Concerns**:
- **Critical**: Can reveal exact home/work addresses
- Creates persistent location history
- Can be used to track movement patterns
- Cannot be anonymized (coordinates are precise)
- Stored permanently in database
- Accessible to server administrators

**Mitigation Measures**:
- Location permission requested only when needed (no background tracking)
- User explicitly chooses to capture location (not automatic)
- Location fields are optional (user can create forms without location)
- Coordinates displayed to user before saving

**Recommendations**:
- Add privacy warning when creating location fields
- Consider coordinate precision reduction (e.g., round to 3 decimal places instead of 6)
- Implement location data expiry
- Add ability to redact/anonymize location after collection

---

### 3. **Media/Images**
**Risk Level**: MEDIUM-HIGH

**Data Collected**:
- Photos from camera or photo library
- Stored as base64-encoded strings in database

**Privacy Concerns**:
- Images may contain faces (biometric data)
- EXIF metadata may include GPS coordinates
- Images may reveal personal/private spaces
- Large storage footprint
- Potentially identifiable information

**Mitigation Measures**:
- Image quality reduced to 30% (compression applied)
- Size warnings for large images (>5MB)
- User explicitly selects/captures each image
- No automatic photo access or background capture

**Recommendations**:
- Strip EXIF metadata before upload
- Implement automatic face blurring option
- Add image preview before saving
- Set hard size limit (10MB maximum)
- Consider storing images separately from database (object storage)

---

### 4. **Network Security**
**Security Measures**:
- All API communication over HTTPS
- JWT token authentication required for all requests
- Bearer token authentication pattern
- Username scoped queries (users can only access own data)

**Risks**:
- JWT token stored in source code (not environment variable)
- No token refresh mechanism
- No session timeout

---

### 5. **Third-Party Services**

**Expo Services**:
- `expo-camera`: Camera access
- `expo-location`: GPS location access
- `expo-clipboard`: Clipboard access
- `expo-image-picker`: Photo library access
- `react-native-maps`: Map display (Google Maps)

**Privacy Implications**:
- Camera/location require system permissions
- Clipboard can expose copied data to other apps
- Google Maps may collect location data

**Mitigation**:
- Permissions requested only when needed
- No analytics or tracking SDKs installed
- No advertising frameworks

---

## User Data Rights

### Current Capabilities:
✅ **View**: Users can view all their collected data
✅ **Delete**: Users can delete individual records
✅ **Export**: Users can copy records to clipboard (JSON format)

### Missing Capabilities:
❌ **Bulk Export**: No way to export all data at once
❌ **Account Deletion**: No way to delete all user data
❌ **Data Portability**: No standard export format (CSV, etc.)
❌ **Access Logs**: No audit trail of who accessed data

---

## Compliance Considerations

### GDPR (if applicable):
- ⚠️ No explicit consent mechanism
- ⚠️ No privacy policy shown to users
- ⚠️ No data retention policy
- ✅ Data minimization (only collect what's needed)
- ❌ No right to be forgotten implementation

### Recommendations for Compliance:
1. Add privacy policy acceptance on first launch
2. Implement "Delete All My Data" function
3. Add data retention settings
4. Provide bulk export functionality
5. Maintain access/modification logs

---

## Best Practices for Users

### DO:
✅ Only collect necessary information
✅ Inform participants about data collection
✅ Use generic field names (avoid "Home Address")
✅ Regularly delete old/unnecessary records
✅ Review location precision needs

### DON'T:
❌ Collect passwords or payment information
❌ Store medical/health data without proper safeguards
❌ Share JWT tokens or credentials
❌ Take photos of sensitive documents
❌ Collect data without participant consent

---

## Risk Summary

| Data Type | Risk Level | Primary Concern | Mitigation Priority |
|-----------|-----------|-----------------|-------------------|
| Location | 🔴 HIGH | Identity/tracking | HIGH |
| Images | 🟠 MEDIUM-HIGH | Biometric data | MEDIUM |
| Text | 🟡 MEDIUM | Sensitive info | MEDIUM |
| Network | 🟡 MEDIUM | Interception | LOW (HTTPS used) |

---

## Incident Response

**If data breach suspected**:
1. Immediately revoke JWT tokens
2. Contact server administrator
3. Notify affected users
4. Review access logs
5. Implement additional security measures

**Contact**: University IT Security Team

---

## Version History
- **v1.0** (2025) - Initial privacy analysis
- Last Updated: January 2025

---

## Acknowledgment

By using FormBase, users acknowledge:
- Data is stored on remote servers
- Location data is highly sensitive
- Images may contain identifiable information
- No guarantee of data permanence or security
- User responsible for compliance with local data protection laws
