const utils          = require('./utils');
const BrowserHandler = require('./handlers/BrowserHandler');
const FileHandler    = require('./handlers/FileHandler');
const PageExtended   = require('./classes/PageExtended');

// *****************************************************************

const selectors = {
    login:{
        EMAIL_INPUT: 'input[name=userEmail]',
        PASSWORD_INPUT: 'input[name=userPassword]',
        SUBMIT_BUTTON: 'button[type=submit]'
    }
};

class ParentLib {
    
    static async readLoginDataFromFile(platformNameToUpper){
        const path = process.cwd() + process.env.LOGIN_DATA_FILE_LOCAL_PATH;
        return FileHandler.readJsonAttribute(path, platformNameToUpper);
    }

    static async doBeforeAll(OtusPageClass, suiteArray) {
        utils.timeout.setTestTimeout();
        let browser = await BrowserHandler.createBrowser();
        let page = (await browser.pages())[0];
        let pageExt = new OtusPageClass(page);
        await pageExt.setDownloadPath();
        pageExt.errorLogger.resetAndSetSpecArray(suiteArray);
        return [browser, pageExt];
    }

    static async login(pageExt, mainPageUrl){
        const loginData = await ParentLib.readLoginDataFromFile(pageExt.typeCodeName);
        await pageExt.gotoUrl(mainPageUrl);
        const buttonSelector = selectors.login.SUBMIT_BUTTON;
        await pageExt.waitForSelector(buttonSelector);
        await pageExt.page.type(selectors.login.EMAIL_INPUT, loginData.email);
        await pageExt.page.type(selectors.login.PASSWORD_INPUT, loginData.password);
        await pageExt.page.click(buttonSelector);
    }

}

module.exports = ParentLib;