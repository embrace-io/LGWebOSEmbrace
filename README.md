# LG webOS Sample

Minimal HTML5/JavaScript starter app for LG webOS TV. Designed for use with the webOS Studio VS Code extension or `ares-cli`.

Quick start


1. Open the `lg-webos-sample` folder in VS Code.
2. Install the webOS Studio extension (search for "webOS" in Extensions).
3. From the webOS Studio panel, choose "Open Project" and point to this folder.
4. Use the built-in emulator or configure a device (IP + credentials) to run.

Using `ares-cli` (optional):

```bash
# Install ares-cli globally if you don't have it
npm install -g ares-cli

# Package the app (creates an .ipk file)
ares-package .

# Install to a configured device (replace .ipk filename as needed)
ares-install com.example.webos.sample_1.0.0_any.ipk -d <device_ip>

# Launch the app
ares-launch com.example.webos.sample
```

Local testing (simple HTTP server):

```bash
# Start a local static server and open http://localhost:8080
npm run start
```

Files
- `appinfo.json` - webOS app manifest
- `index.html` - app entry
- `src/main.js` - app script with key handling
- `css/style.css` - basic styles

Next steps

- Open the folder in VS Code and use the webOS Studio extension to import this project.
- Configure a webOS emulator image from webOS Studio if you want to test without a device.
- To sign and publish, follow LG's developer documentation (developer.lge.com) for obtaining keys and creating a signed package.
- If you want, I can add sample scenes, focus management, or luna-service calls next.

