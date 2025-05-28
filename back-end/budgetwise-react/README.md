### CreateName.js

```jsx
import React, { useState } from 'react';

const CreateName = () => {
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to the server
    // For now, let's just log the full name
    console.log(fullName);
    // You can also set a message if needed
    setMessage('Name submitted successfully!');
  };

  return (
    <div className="create-name-container">
      <h1>Enter Your Name</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        {message && <p style={{ color: 'red' }}>{message}</p>} {/* Display validation message */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateName;
```

4. **Update App.js**: Now, you need to import and use the `CreateName` component in your `App.js` file.

### App.js

```jsx
import React from 'react';
import CreateName from './CreateName';
import './App.css'; // Make sure to import your CSS file if you have styles

function App() {
  return (
    <div className="App">
      <CreateName />
    </div>
  );
}

export default App;
```

5. **Add CSS**: If you have any CSS styles, you can add them to `App.css` or create a separate CSS file for your component. Make sure to include any necessary styles to maintain the look and feel of your original project.

### App.css (Example)

```css
.create-name-container {
  /* Add your styles here */
}

.form-group {
  margin-bottom: 15px;
}

button {
  /* Add button styles here */
}
```

6. **Run Your React App**: Finally, you can run your React application to see the result. In your terminal, run:

   ```bash
   npm start
   ```

This will start the development server, and you should see your form rendered in the browser.

### Summary
You have now successfully converted your HTML and CSS project into a React project. You can further enhance the functionality by adding form validation, API calls, or any other features as needed.