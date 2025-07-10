// MSAL instance and widget initialization
let publicClientApplication;
let accountId = null;

// Define loginRequest at the top so it's available everywhere
const loginRequest = {
  scopes: ["openid", "profile" ],

};

function msalWidgetInit() {
  if (!publicClientApplication) {
    publicClientApplication = new msal.PublicClientApplication({
      auth: {

          
        //personal
        authority: "https://login.microsoftonline.com/a083acb1-aba6-472c-8701-d8fa2739ff40",
        clientId: "c0bfa58e-6b6d-4949-99b1-a90c8d06deab",
        knownAuthorities: ["https://login.microsoftonline.com/a083acb1-aba6-472c-8701-d8fa2739ff40"],
        // postLogoutRedirectUri: "/",
        redirectUri: "http://localhost:4200/"
      },
      cache: {
        cacheLocation: "memoryStorage",
        storeAuthStateInCookie: true
      } 
    });
  }
  // Now safe to call MSAL-dependent logic
  handleRedirect();
}

async function handleRedirect() {
  await publicClientApplication.initialize();
  const response = await publicClientApplication.handleRedirectPromise();
  if (response && response.account) {
    publicClientApplication.setActiveAccount(response.account);
    
    console.log("Authentication successful (redirect response):", response.account);
  }
  const accounts = publicClientApplication.getAllAccounts();
  if (!publicClientApplication.getActiveAccount() && accounts.length > 0) {
    publicClientApplication.setActiveAccount(accounts[0]);
   
    console.log("Account set from getAllAccounts:", accounts[0]);
  }
}

// Only call msalWidgetInit after MSAL script is loaded
if (typeof msal !== 'undefined') {
  msalWidgetInit();
}

  

async function acquireToken() {
  await initialize(false);

  const accounts = publicClientApplication.getAllAccounts();
  alert(`Number of accounts: ${accounts.length}`);

  if (accounts.length === 0) {
    publicClientApplication.loginRedirect(loginRequest);
    return;
  }

  // Ensure active account is set
  let activeAccount = publicClientApplication.getActiveAccount();
  if (!activeAccount) {
    publicClientApplication.setActiveAccount(accounts[0]);
    activeAccount = accounts[0];
  }

  alert("User already logged in acquireToken(), acquiring token silently");
   
  const lRequest = {
    scopes: ["openid", "profile" ],
    account: activeAccount
  };

  try {
    const accessTokenResponse = await publicClientApplication.acquireTokenSilent(lRequest);
    const accessToken = accessTokenResponse.accessToken;
    console.log(`Access Token: ${accessToken}`);
    // Call your API with token
    // callApi(accessToken);
  } catch (error) {
    console.error("Token acquisition failed:", error);
    publicClientApplication.acquireTokenRedirect(lRequest);
  }
}


async function checkUserLogin() {
  await initialize(false);

  const gaccounts = publicClientApplication.getAllAccounts();
  if (gaccounts.length > 0) {
    let activeAccount = publicClientApplication.getActiveAccount();
    if (!activeAccount) {
      publicClientApplication.setActiveAccount(gaccounts[0]);
      activeAccount = gaccounts[0];
    }
    alert(`Number of Global accounts: checkUserLogin() ${gaccounts.length}`);
    const lRequest = {
      scopes: ["openid", "profile" ],
      account: activeAccount
    };
    try {
      const accessTokenResponse = await publicClientApplication.acquireTokenSilent(lRequest);
      const accessToken = accessTokenResponse.accessToken;
      console.log(`Access Token: ${accessToken}`);
      alert("User already logged in, checkUserLogin() acquiring token silently");
    } catch (error) {
      console.error("Token acquisition failed:", error);
    }
  } else {
    alert("No accounts found. Please sign in first.");
  }
}
  

async function logout(){
    // const { publicClientApplication, loginRequest } = initialize();
    await initialize(false);
  try {
     publicClientApplication.logout({
      //postLogoutRedirectUri: "https://localhost:4200/logout.html" // Optional: Redirect after logout
      //mainWindowRedirectUri: "YOUR_MAIN_WINDOW_REDIRECT_URI" // Optional: Redirect main window
    });
    clearStorage(); // Clear storage after logout
    // Logout successful, redirect or take other actions
    console.log("Logout successful!");
  } catch (error) {
    // Handle logout error
    console.error("Logout failed:", error);
  }
};
  

// Add a simple initialize function that calls handleRedirect
async function initialize() {
  if (!publicClientApplication) {
    msalWidgetInit();
  }
  await handleRedirect();
}
