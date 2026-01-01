# Installing Supabase CLI

## Windows Installation

### Option 1: Using Scoop (Recommended - Easiest)

1. **Install Scoop** (if you don't have it):
   ```powershell
   # Open PowerShell as Administrator
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Install Supabase CLI:**
   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

3. **Verify installation:**
   ```powershell
   supabase --version
   ```

### Option 2: Using npm (Node.js Required)

1. **Make sure you have Node.js installed:**
   - Download from: https://nodejs.org/
   - Or check if installed: `node --version`

2. **Install Supabase CLI globally:**
   ```cmd
   npm install -g supabase
   ```

3. **Verify installation:**
   ```cmd
   supabase --version
   ```

### Option 3: Using Chocolatey

1. **Install Chocolatey** (if you don't have it):
   - Visit: https://chocolatey.org/install
   - Follow the installation instructions

2. **Install Supabase CLI:**
   ```cmd
   choco install supabase
   ```

3. **Verify installation:**
   ```cmd
   supabase --version
   ```

### Option 4: Direct Download (Manual)

1. **Download the latest release:**
   - Go to: https://github.com/supabase/cli/releases
   - Download `supabase_windows_amd64.zip` (or appropriate version)

2. **Extract and add to PATH:**
   - Extract the zip file
   - Copy `supabase.exe` to a folder in your PATH (e.g., `C:\Windows\System32`)
   - Or add the folder to your PATH environment variable

3. **Verify installation:**
   ```cmd
   supabase --version
   ```

## After Installation

### 1. Login to Supabase

```cmd
supabase login
```

This will open your browser to authenticate.

### 2. Link Your Project

```cmd
cd Creative-Autopilot-main
supabase link --project-ref rslyvblyizosebqqxnmv
```

Replace `rslyvblyizosebqqxnmv` with your actual project reference if different.

### 3. Set Secrets

```cmd
supabase secrets set HUGGINGFACE_API_KEY=hf_your_token_here
supabase secrets set GOOGLE_AI_API_KEY=your_google_key_here
```

### 4. Deploy Functions

```cmd
# Deploy a single function
supabase functions deploy generate-creative

# Or deploy all functions
supabase functions deploy
```

## Quick Start Commands

```cmd
# Check version
supabase --version

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# List secrets
supabase secrets list

# Set secret
supabase secrets set KEY_NAME=value

# Deploy function
supabase functions deploy function-name

# View logs
supabase functions logs function-name
```

## Troubleshooting

### "supabase: command not found"

- Make sure you added Supabase to your PATH
- Try restarting your terminal/command prompt
- Verify installation: Check if `supabase.exe` exists in your PATH directories

### "Permission denied" (npm installation)

- Try running as Administrator
- Or use: `npm install -g supabase --unsafe-perm=true`

### "Node.js not found" (npm method)

- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

## Recommended Method

For Windows, I recommend **Option 1 (Scoop)** or **Option 2 (npm)** as they're the easiest and keep the CLI updated automatically.

If you already have Node.js installed, use npm. If not, try Scoop for a cleaner installation.

