import {connectToDatabase} from "../../lib/dbConnect";

// eslint-disable-next-line import/no-anonymous-default-export
/**
 * Asynchronous function to handle user login or account check based on the request body parameters.
 *
 * @param {Object} req - The request object containing body parameters such as loginType, loginValue, and loginFrom.
 * @param {Object} res - The response object to send the appropriate JSON response based on the login state.
 *
 * Destructures `loginType`, `loginValue`, and `loginFrom` from the request body to determine the login criteria.
 * Determines the search term based on the `loginType` (email or phone) to find a matching user in the database.
 * Connects to the database and attempts to locate a user document using the specified login criteria.
 *
 * Provides different response scenarios based on the `loginFrom` parameter and whether a matching user was found:
 * - "existing-account" checks if a user exists:
 *   - Responds with success if a matching account is found.
 *   - Responds with an error message if no account is found.
 * - When creating a new account:
 *   - Responds with an error message if a user already exists with the provided login information.
 *   - Responds with success if no account exists with the provided login information.
 *
 * Logs the outcome of the database query for debugging purposes.
 * Sends a default JSON response if no return condition is explicitly met (e.g., duplicate accounting handling or errors).
 */
export default async(req, res) => {

    const {loginType, loginValue, loginFrom} = req.body;
    const term = loginType === 'email' ? { email: loginValue } : { phone: loginValue };

    const {db} = await connectToDatabase();
    const user = await db.collection("users").findOne(term);

    console.log('CHECK NEW ACCOUNT: ', user);

    if (loginFrom === 'existing-account') {
        if (user) {
            res.json({code: 666, message: "SCENARIO 0: Success."})
        }
        res.json({code: 777, message: "SCENARIO 1: No account found with this login.  Please try again or create a new account.", loginValue, user})
    } else {
        if (user) {
            res.json({code: 666, message: "SCENARIO 2: There is already an account with that email address."})
        }
        res.json({code: 777, message: "SCENARIO 3: No account found with this login.  Please try again or create a new account.", loginValue, user})
    }

    res.json(user);
}
