# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



---


🔍 Find process using port (example: 3000)
netstat -ano | findstr :3000
💀 Kill that process (replace PID)
taskkill /PID 12345 /F


psql -U postgres -d university_erp -f /home/admin/files/folder/studbackend/migrations/admissions/add_enquiries_table.sql


-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS admissions;

-- Drop table if you want a fresh creation
-- DROP TABLE IF EXISTS admissions.enquiries;

CREATE TABLE IF NOT EXISTS admissions.enquiries
(
    id BIGINT GENERATED ALWAYS AS IDENTITY,

    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email_address TEXT NOT NULL,

    country TEXT,
    state TEXT,
    district TEXT,

    preferred_campus BIGINT,
    qualification_type TEXT,
    program_id BIGINT,

    status TEXT DEFAULT 'pending',
    otp_verified BOOLEAN DEFAULT FALSE,
    otp_sent_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT enquiries_pkey PRIMARY KEY (id),
    CONSTRAINT enquiries_mobile_number_key UNIQUE (mobile_number),
    CONSTRAINT enquiries_email_address_key UNIQUE (email_address)
);

ALTER TABLE admissions.enquiries
    OWNER TO postgres;

CREATE INDEX IF NOT EXISTS idx_admissions_enquiries_status
    ON admissions.enquiries (status);

CREATE INDEX IF NOT EXISTS idx_admissions_enquiries_created_at
    ON admissions.enquiries (created_at DESC);