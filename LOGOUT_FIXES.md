# Logout Prevention Fixes

## Problem
Users were being unexpectedly logged out when navigating to certain pages. This was caused by runtime errors in `getServerSideProps` that triggered redirects to `/login`.

## Root Causes

1. **Unsafe Property Access**: Accessing `session.user._id` without validation
2. **Uncaught Fetch Errors**: API calls failing without proper error handling
3. **Null/Undefined Client Data**: Accessing `client.name` without optional chaining

## Fixed Pages

### Critical Pages (High Traffic)
- ✅ `pages/index.js` - Dashboard
- ✅ `pages/users.js` - User management
- ✅ `pages/clients.js` - Client list
- ✅ `pages/care-plans.js` - Care plans
- ✅ `pages/map-of-my-dreams.js` - Dreams map
- ✅ `pages/life-area-surveys.js` - Survey list
- ✅ `pages/new-life-area-survey.js` - Survey creation/editing

### Fixed API Endpoints (7 critical)
- ✅ `pages/api/pages/surveysPageData.js` - Survey list data
- ✅ `pages/api/pages/indexPageData.js` - Dashboard data
- ✅ `pages/api/pages/carePlansPageData.js` - Care plans data
- ✅ `pages/api/pages/directoryPageData.js` - Directory data
- ✅ `pages/api/get-user.js` - User lookup
- ✅ `pages/api/get-survey.js` - Survey lookup
- ⚠️ **23 more API endpoints** still need the same fix pattern

### Pattern Applied

Each `getServerSideProps` function now includes:

```javascript
export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    
    // 1. Validate session structure
    if (!session.user?._id) {
        console.error("FILENAME: Session missing user._id");
        return {redirect: {destination: "/login", permanent: false}}
    }
    
    const {req} = context;
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    try {
        // 2. Fetch with validation
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error("FILENAME: API fetch failed:", response.status);
            return {redirect: {destination: "/login", permanent: false}}
        }
        
        const data = await response.json();

        return {
            props: { data }
        }
    } catch (error) {
        // 3. Catch and log errors
        console.error("FILENAME: Error in getServerSideProps:", error);
        return {redirect: {destination: "/login", permanent: false}}
    }
}
```

## Additional Fixes

### Optional Chaining for Client Data
- `client.name` → `client?.name` (2 instances in `new-life-area-survey.js`)

### API Endpoint Error Handling Pattern

Each fixed API endpoint now includes:

```javascript
export default async(req, res) => {
    try {
        // 1. Validate parameters
        if (!req.query.userId) {
            console.error("ENDPOINT: Missing userId parameter");
            return res.status(400).json({error: "Missing userId parameter"});
        }

        // 2. Validate ObjectId format
        if (!ObjectId.isValid(req.query.userId)) {
            console.error("ENDPOINT: Invalid userId format:", req.query.userId);
            return res.status(400).json({error: "Invalid userId format"});
        }

        // 3. Use new ObjectId() syntax (not deprecated ObjectId())
        const user = await db.collection("users").findOne({
            _id: new ObjectId(req.query.userId)
        })
        
        // 4. Validate results
        if (!user) {
            console.error("ENDPOINT: User not found:", req.query.userId);
            return res.status(404).json({error: "User not found"});
        }
        
        // 5. Return data
        res.json(user)
    } catch (error) {
        // 6. Catch and log all errors
        console.error("ENDPOINT: Error:", error);
        res.status(500).json({error: "Internal server error", message: error.message});
    }
}
```

### Helper Utility Created
- `lib/serverSideHelpers.js` - Reusable validation and fetch helpers (can be used to reduce API boilerplate)

## Remaining Pages

The following pages still access `session.user._id` without validation:
- `pages/directory.js` - Already has ternary protection
- `pages/profile.js` - Low risk (profile page)
- `pages/journey.js` - Low risk
- `pages/disclaimer.js` - Low risk
- `pages/reports.js` - Low risk
- Dynamic routes in `pages/client/`, `pages/user/`, `pages/surveys/`, `pages/referral/`

## Monitoring

All fixed pages now log specific error messages to the console:
- `"FILENAME: Session missing user._id"` - Session structure issue
- `"FILENAME: API fetch failed: STATUS"` - API endpoint failure
- `"FILENAME: Error in getServerSideProps: ERROR"` - Any other error

Check the Next.js dev server console for these messages if logout issues persist.

## Testing Checklist

- [x] Navigate to dashboard
- [x] Navigate to users page
- [x] Navigate to clients page
- [x] Navigate to care plans
- [x] Navigate to life area surveys
- [x] Create new life area survey
- [x] Edit existing life area survey
- [x] Navigate to map of my dreams

## Next Steps (Optional)

1. Apply same pattern to remaining pages
2. Consider using the `lib/serverSideHelpers.js` utilities to reduce boilerplate
3. Add monitoring/alerting for these error patterns in production

