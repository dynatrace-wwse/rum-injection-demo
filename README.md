# 🧪 Loading a Temporary Firefox Add-on

This guide helps you temporarily load a custom add-on in Firefox using the built-in extensions menu. This is the only method to achieve this in Firefox without submiting the addon for approval. 


## 🛠️ Load the Add-on

1. **Open Firefox**
   - Launch the Firefox browser

2. **Go to Debug Extensions**
   - Type `about:debugging` in the address bar and hit Enter
   - In newer versions, choose **This Firefox**

3. **Click "Load Temporary Add-on"**
   - Click the **Load Temporary Add-on** button
   - Browse to your extension directory
   - Select the `manifest.json` file. It will load the full folder.

4. **Verify Installation**
   - Your add-on should now appear in the list of installed extensions
   - Clicking the extension will provide you with various options to target a specific page for injection and for including the javascript file from your RUM tag

## 🔄 Keep in Mind

- Temporary add-ons are removed when Firefox is closed
- You'll need to reload them each time you restart the browser

---

Happy testing!