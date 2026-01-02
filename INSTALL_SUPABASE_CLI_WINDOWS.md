# Installing Supabase CLI on Windows

## ⚠️ Important: npm global install is NOT supported

Supabase CLI **does not support** `npm install -g supabase` anymore. Use one of these methods instead:

## Method 1: Using Scoop (Recommended for Windows)

### Step 1: Install Scoop (if needed)

Open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Step 2: Install Supabase CLI

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 3: Verify

```powershell
supabase --version
```

## Method 2: Using Chocolatey

### Step 1: Install Chocolatey (if needed)

Visit: https://chocolatey.org/install
Run the installation command in PowerShell as Administrator.

### Step 2: Install Supabase CLI

```cmd
choco install supabase
```

## Method 3: Direct Download

1. Go to: https://github.com/supabase/cli/releases/latest
2. Download: `supabase_windows_amd64.zip`
3. Extract the zip file
4. Add `supabase.exe` to your PATH or place it in `C:\Windows\System32`

## After Installation

### 1. Login

```cmd
supabase login
```

### 2. Link Your Project

```cmd
cd Creative-Autopilot-main
supabase link --project-ref rslyvblyizosebqqxnmv
```

### 3. Set Your API Key Secret

```cmd
supabase secrets set HUGGINGFACE_API_KEY=hf_your_token_here
```

### 4. Deploy the Function

```cmd
supabase functions deploy generate-creative
```

## Quick Reference

- **Check version:** `supabase --version`
- **Login:** `supabase login`
- **Link project:** `supabase link --project-ref YOUR_PROJECT_REF`
- **Set secret:** `supabase secrets set KEY=value`
- **Deploy function:** `supabase functions deploy function-name`
- **View logs:** `supabase functions logs function-name`

