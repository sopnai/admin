# Development Guide

This guide explains how to run the Flawless Admin Panel frontend alongside your backend API and how to run tests.

---

## Prerequisites

- **Node.js** 18+ (or 20+)
- **Yarn** or npm
- **Backend API** running (see your backend documentation for setup)

---

## Running Frontend with Backend

### Step 1: Configure Environment Variables

Create a `.env` file in the project root (`admin-main/`) with your backend API URL:

```env
# Backend API Base URL (no trailing slash)
REACT_APP_API_URL=http://localhost:3000/admin

# Authentication mode: 'fake', 'jwt', or 'firebase'
# Use 'jwt' when connecting to real backend
REACT_APP_DEFAULTAUTH=jwt

# Disable ESLint during webpack build (optional, already in .env)
DISABLE_ESLINT_PLUGIN=true
```

**Important:**
- Replace `http://localhost:3000/admin` with your actual backend URL and port
- If your backend runs on a different port (e.g., `5000`, `8000`), update accordingly
- For production, use `https://your-api-domain.com/admin`

### Step 2: Start Backend Server

Open **Terminal 1** and start your backend:

```bash
# Navigate to your backend directory
cd /path/to/your/backend

# Start backend (adjust command based on your backend)
# Examples:
npm start
# or
yarn start
# or
node server.js
# or
python manage.py runserver  # Django
# or
rails server  # Rails
```

**Verify backend is running:**
- Check the console output for the port (e.g., `Server running on port 3000`)
- Test with: `curl http://localhost:3000/admin/login` (or your backend's health endpoint)

### Step 3: Start Frontend Development Server

Open **Terminal 2** (keep backend running in Terminal 1) and start the React app:

```bash
# Navigate to admin-main directory
cd admin-main

# Install dependencies (first time only)
yarn install
# or: npm install

# Start development server
yarn start
# or: npm start
```

The frontend will:
- Start on `http://localhost:3000` (or next available port if 3000 is taken)
- Automatically open in your browser
- Hot-reload on file changes

### Step 4: Verify Connection

1. **Check browser console** (F12 → Console) for any CORS or connection errors
2. **Try logging in:**
   - Go to `http://localhost:3000/login`
   - Use your backend admin credentials
   - If using fake auth for testing: `admin@gmail.com` / `123456`

---

## Running Both with a Single Command (Optional)

### Using `concurrently` (npm package)

Install `concurrently` globally or as a dev dependency:

```bash
yarn add -D concurrently
# or: npm install --save-dev concurrently
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd ../backend && npm start",
    "start:frontend": "react-scripts start"
  }
}
```

Then run:

```bash
yarn dev
```

**Note:** Adjust `start:backend` command to match your backend's start script and path.

### Using a Shell Script (Linux/Mac)

Create `start-dev.sh`:

```bash
#!/bin/bash
# Start backend in background
cd /path/to/backend && npm start &
BACKEND_PID=$!

# Start frontend
cd admin-main && yarn start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
```

Make executable and run:

```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Using PowerShell Script (Windows)

Create `start-dev.ps1`:

```powershell
# Start backend in background job
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\path\to\backend"
    npm start
}

# Start frontend
Set-Location "admin-main"
yarn start

# Cleanup (Ctrl+C to stop)
Stop-Job $backendJob
Remove-Job $backendJob
```

Run:

```powershell
.\start-dev.ps1
```

---

## Testing

### Running Tests

The project uses **React Testing Library** and **Jest** (via `react-scripts`).

#### Run All Tests

```bash
yarn test
# or: npm test
```

This starts Jest in **watch mode**:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit
- Press `p` to filter by filename pattern
- Press `t` to filter by test name pattern

#### Run Tests Once (CI Mode)

```bash
CI=true yarn test
# or: CI=true npm test
```

#### Run Tests with Coverage

```bash
yarn test --coverage
# or: npm test --coverage
```

Coverage report will be generated in `coverage/` directory.

#### Run a Specific Test File

```bash
yarn test App.test.js
# or: npm test App.test.js
```

### Writing Tests

#### Example Test Structure

Create test files next to components: `ComponentName.test.js` or `ComponentName.spec.js`

```javascript
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../store'
import YourComponent from './YourComponent'

// Helper to render with Redux and Router
const renderWithProviders = (component) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  )
}

describe('YourComponent', () => {
  test('renders correctly', () => {
    renderWithProviders(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  test('handles user interaction', async () => {
    renderWithProviders(<YourComponent />)
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Updated Text')).toBeInTheDocument()
    })
  })
})
```

#### Testing Redux Components

```javascript
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import YourComponent from './YourComponent'

const mockStore = configureStore([])

test('component with Redux state', () => {
  const store = mockStore({
    Login: { user: { email: 'test@example.com' } },
    DashboardRD: { dashboard: { totalClients: 10 } }
  })

  render(
    <Provider store={store}>
      <YourComponent />
    </Provider>
  )

  expect(screen.getByText('test@example.com')).toBeInTheDocument()
})
```

#### Testing API Calls (Mocking)

```javascript
import axios from 'axios'
import { getDashboardData } from '../helpers/Module'

jest.mock('axios')

test('fetches dashboard data', async () => {
  const mockData = { totalClients: 10, totalArtists: 5 }
  axios.get.mockResolvedValue({ data: mockData })

  const result = await getDashboardData()
  expect(result).toEqual(mockData)
  expect(axios.get).toHaveBeenCalledWith('/dashboardCount', expect.any(Object))
})
```

#### Testing Redux Sagas

```javascript
import { call, put } from 'redux-saga/effects'
import { getDashboardData } from 'helpers/Module'
import { listDashboard, setLoadingDashboard } from '../actions'
import { FunctionfetchDshboardData } from '../saga'

test('dashboard saga fetches data', () => {
  const generator = FunctionfetchDshboardData({ payload: {} })
  const mockData = { totalClients: 10 }

  expect(generator.next().value).toEqual(put(setLoadingDashboard(true)))
  expect(generator.next().value).toEqual(call(getDashboardData, {}))
  expect(generator.next(mockData).value).toEqual(put(listDashboard(mockData)))
  expect(generator.next().value).toEqual(put(setLoadingDashboard(false)))
  expect(generator.next().done).toBe(true)
})
```

### Test Files Location

- Place test files next to components: `src/components/Component/Component.test.js`
- Or in a `__tests__` folder: `src/components/Component/__tests__/Component.test.js`
- Example: `src/App.test.js` (already exists)

---

## Troubleshooting

### CORS Errors

**Problem:** Browser console shows CORS errors when calling backend API.

**Solutions:**

1. **Backend must allow CORS from frontend origin:**
   - Add CORS headers in your backend (e.g., `Access-Control-Allow-Origin: http://localhost:3000`)
   - For Express.js: `app.use(cors({ origin: 'http://localhost:3000' }))`

2. **Use a proxy in development** (Create React App):
   Add to `package.json`:
   ```json
   {
     "proxy": "http://localhost:3000"
   }
   ```
   Then use relative URLs in API calls (e.g., `/admin/login` instead of full URL).

### Port Already in Use

**Problem:** `Port 3000 is already in use`

**Solutions:**

1. **Kill process on port 3000:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

2. **Use different port:**
   ```bash
   PORT=3001 yarn start
   # or: set PORT=3001 && yarn start (Windows)
   ```

### Environment Variables Not Loading

**Problem:** `REACT_APP_API_URL` is undefined.

**Solutions:**

1. **Restart dev server** after changing `.env`
2. **Variable must start with `REACT_APP_`**
3. **Check `.env` is in project root** (same level as `package.json`)
4. **Clear browser cache** and hard refresh (Ctrl+Shift+R)

### Backend Connection Refused

**Problem:** `Network Error` or `ECONNREFUSED`

**Solutions:**

1. **Verify backend is running** (check Terminal 1)
2. **Check backend port** matches `.env` `REACT_APP_API_URL`
3. **Check backend URL** has no trailing slash (e.g., `http://localhost:3000/admin` not `http://localhost:3000/admin/`)
4. **Test backend directly:** `curl http://localhost:3000/admin/login` (or use Postman)

### Tests Failing

**Problem:** Tests fail with module/import errors.

**Solutions:**

1. **Clear Jest cache:**
   ```bash
   yarn test --clearCache
   ```

2. **Check test environment:** Ensure `@testing-library/react` and `@testing-library/jest-dom` are installed

3. **Mock missing modules:**
   ```javascript
   // In test file or setupTests.js
   jest.mock('module-name', () => ({
     default: jest.fn()
   }))
   ```

### Hot Reload Not Working

**Problem:** Changes don't reflect in browser.

**Solutions:**

1. **Hard refresh:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear browser cache**
3. **Restart dev server**
4. **Check file is saved** (no unsaved changes indicator)

---

## Development Workflow

### Recommended Workflow

1. **Start backend first** (Terminal 1)
2. **Verify backend is accessible** (curl/Postman)
3. **Start frontend** (Terminal 2)
4. **Open browser** to `http://localhost:3000`
5. **Check browser console** for errors
6. **Make changes** → auto-reloads
7. **Run tests** before committing: `yarn test`

### Before Committing

```bash
# Run linter
yarn lint

# Run tests
yarn test --watchAll=false

# Format code (optional)
yarn format
```

---

## Additional Resources

- **React Testing Library Docs:** https://testing-library.com/docs/react-testing-library/intro/
- **Jest Docs:** https://jestjs.io/docs/getting-started
- **Create React App Testing:** https://create-react-app.dev/docs/running-tests/
- **Redux Testing:** https://redux.js.org/usage/writing-tests

---

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `yarn install` |
| Start frontend | `yarn start` |
| Start backend | `cd backend && npm start` |
| Run tests | `yarn test` |
| Run tests (CI) | `CI=true yarn test` |
| Run tests with coverage | `yarn test --coverage` |
| Lint code | `yarn lint` |
| Format code | `yarn format` |
| Build for production | `yarn build` |
