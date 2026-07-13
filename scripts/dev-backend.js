const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const backendDir = path.join(__dirname, "..", "backend");
const python =
  process.platform === "win32"
    ? path.join(backendDir, "venv", "Scripts", "python.exe")
    : path.join(backendDir, "venv", "bin", "python");

if (!fs.existsSync(python)) {
  console.error(
    "\nBackend venv not found. Run setup first:\n" +
      "  cd backend\n" +
      "  python -m venv venv\n" +
      "  .\\venv\\Scripts\\Activate.ps1   (Windows)\n" +
      "  source venv/bin/activate       (macOS/Linux)\n" +
      "  pip install -r requirements.txt\n" +
      "  python manage.py migrate\n" +
      "  python manage.py create_demo_user\n",
  );
  process.exit(1);
}

const child = spawn(python, ["manage.py", "runserver"], {
  cwd: backendDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 0));
