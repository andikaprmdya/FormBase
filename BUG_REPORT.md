# FormBase - Bug Report & Issues

Generated: 2025-10-27

## 🔴 Critical Issues

### 1. TypeScript Type Errors

#### 1.1 Button Component - Animation Style Type Mismatch
**Location:** `src/components/Button.tsx:113`
**Issue:** Type incompatibility between ViewStyle and AnimatedStyle
```typescript
style={[getButtonStyle(), style, springProps]}
```
**Impact:** TypeScript compilation warnings, but shouldn't affect runtime
**Severity:** Low (TypeScript warning only)
**Fix:** Add proper type assertions or update style prop types to accept animated styles

#### 1.2 RecordsListScreen - Navigation Type Error
**Location:** `src/screens/RecordsListScreen.tsx:194`
**Issue:** Attempting to navigate to 'FormsTab' which is not in RootStackParamList
```typescript
navigation.navigate('FormsTab')  // FormsTab is in TabParamList, not RootStackParamList
```
**Impact:** TypeScript error, navigation may fail at runtime
**Severity:** Medium
**Fix:** Use proper nested navigation or navigate to MainTabs instead
```typescript
navigation.navigate('MainTabs', { screen: 'FormsTab' })
```

#### 1.3 RecordsListScreen - Missing JSX Namespace
**Location:** `src/screens/RecordsListScreen.tsx:120`
**Issue:** `Cannot find namespace 'JSX'`
**Impact:** TypeScript compilation error
**Severity:** Low
**Fix:** Import React properly or update return type annotation

#### 1.4 MapListScreen - Navigation Parameter Type Error
**Location:** `src/screens/MapListScreen.tsx:87`
**Issue:** Passing params to MainTabs navigation which expects undefined
```typescript
navigation.navigate('MainTabs', {
  screen: 'MapTab',
  params: { centerLat, centerLng }
})
```
**Impact:** TypeScript error
**Severity:** Low-Medium
**Fix:** Update TabParamList to properly support nested navigation params

---

## 🟡 Medium Priority Issues

### 2. Console Logging
**Location:** Multiple files (64 instances across 13 files)
**Issue:** Excessive console.log/console.error statements throughout the codebase
**Files affected:**
- `src/services/api.ts` (32 instances)
- All screen files
- `src/components/ErrorBoundary.tsx`

**Impact:** Performance impact in production, debug info exposed
**Severity:** Medium
**Recommendation:**
- Remove or disable console.logs in production
- Use a logging library with configurable log levels
- Consider implementing __DEV__ checks:
```typescript
if (__DEV__) {
  console.log('Debug info');
}
```

### 3. Error Handling Inconsistencies

#### 3.1 Generic Error Messages
**Location:** Multiple API calls
**Issue:** Some error handlers use generic messages instead of specific ones
**Example:** `src/screens/FormDetailScreen.tsx:25`
```typescript
catch (err) {
  setError('Failed to load fields. Please try again.');
}
```
**Recommendation:** Provide more specific error messages based on error type

#### 3.2 Missing Error Type Guards
**Location:** Throughout codebase
**Issue:** Errors are typed as `any` without proper type checking
**Example:**
```typescript
catch (err: any) {
  const errorMessage = err?.message?.includes('Failed to fetch')
}
```
**Recommendation:** Use proper error type guards or create custom error types

---

## 🟢 Minor Issues & Code Quality

### 4. Code Quality Issues

#### 4.1 Unused File
**Location:** `nul` file in root directory
**Issue:** Empty or unnecessary file in project root
**Severity:** Very Low
**Fix:** Delete the file

#### 4.2 Missing Dependency Arrays
**Location:** Various useEffect and useCallback hooks
**Issue:** Some dependency arrays might be incomplete
**Example:** `src/screens/FormDetailScreen.tsx:35` - Empty dependency array
**Impact:** Potential stale closures
**Recommendation:** Review all hooks and add exhaustive deps

#### 4.3 Hardcoded Credentials
**Location:** `src/services/api.ts:4-5`
**Issue:** JWT token and username hardcoded in source
```typescript
const JWT_TOKEN = 'eyJhbGci...';
const USERNAME = 's4905889';
```
**Security:** This appears to be for a university assignment/course, so may be intentional
**Recommendation:** For production, move to environment variables

#### 4.4 Magic Numbers
**Location:** Multiple files
**Issue:** Hardcoded numbers without named constants
**Examples:**
- Image quality: `quality: 0.3` (RecordCreateScreen.tsx:93)
- Latitude offset: `-0.015` (MapScreen.tsx:58, 102, 147, 171)
- File size limits: `5242880`, `10485760` (RecordCreateScreen.tsx)

**Recommendation:** Extract to named constants:
```typescript
const IMAGE_QUALITY = 0.3;
const MAP_LATITUDE_OFFSET = -0.015;
const IMAGE_SIZE_WARNING_THRESHOLD = 5 * 1024 * 1024; // 5MB
const IMAGE_SIZE_HARD_LIMIT = 10 * 1024 * 1024; // 10MB
```

---

## 🔵 Enhancement Opportunities

### 5. Potential Improvements

#### 5.1 Loading States
**Location:** Multiple screens
**Issue:** No intermediate loading states for slow operations
**Recommendation:** Add skeleton screens or progress indicators

#### 5.2 Data Validation
**Location:** Form inputs throughout
**Issue:** Limited client-side validation
**Recommendation:** Add comprehensive validation before API calls

#### 5.3 Image Optimization
**Location:** `src/screens/RecordCreateScreen.tsx`
**Current:** Images compressed to 30% quality, 10MB limit
**Recommendation:**
- Consider progressive compression
- Add image dimension limits
- Implement server-side resizing

#### 5.4 Offline Support
**Location:** Entire app
**Issue:** No offline data caching or queue
**Recommendation:** Implement AsyncStorage caching for offline viewing

#### 5.5 Accessibility
**Location:** Throughout
**Issue:** Limited accessibility labels and features
**Recommendation:** Add proper accessibility props for screen readers

---

## 📊 Statistics

- **Total TypeScript files:** 32
- **Console statements:** 64 across 13 files
- **TypeScript errors:** 4
- **Screens:** 15
- **Components:** 9
- **API endpoints:** 3 (form, field, record)

---

## ✅ Well-Implemented Features

### Positive Aspects:
1. **Filter System:** Now properly working with correct PostgREST syntax for OR/AND queries
2. **Error Boundaries:** Proper error boundary implementation
3. **Component Structure:** Clean separation of concerns
4. **UI/UX:** Apple-style glass design is well implemented
5. **Type Safety:** Good use of TypeScript interfaces and types
6. **API Abstraction:** Clean API service layer
7. **Navigation:** Proper React Navigation setup with nested navigators
8. **Form Validation:** Good field validation in RecordCreateScreen

---

## 🎯 Priority Fixes

### Immediate (Before Production):
1. Fix navigation type errors in RecordsListScreen.tsx:194
2. Fix MapListScreen navigation params type
3. Remove or conditionally disable console.logs

### Short Term:
1. Extract magic numbers to constants
2. Improve error messages
3. Add proper TypeScript error types
4. Fix Button component style types

### Long Term:
1. Implement offline support
2. Add comprehensive testing
3. Improve accessibility
4. Add analytics/monitoring
5. Consider state management library (Redux, Zustand) for complex state

---

## 📝 Notes

- The OR filter bug has been **FIXED** ✅
- All filter operators (eq, gt, lt, gte, lte, like, ilike) tested and working ✅
- Mixed AND/OR filter combinations working correctly ✅
- Enhanced API logging added for debugging ✅
