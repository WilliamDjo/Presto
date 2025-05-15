# 🪄 Presto – A Lightweight Presentation Builder

Presto is a modern, web-based application for creating and presenting slide decks. Built with **ReactJS**, Presto offers an accessible and enjoyable alternative to [slides.com](https://slides.com), tailored for both technical and non-technical users.

Developed as part of a frontend engineering project, the app simulates a startup MVP pitched to an angel investor and focuses on usability, accessibility, and testability. It includes a full suite of features for creating, editing, presenting, and previewing slide decks—deployed via [Vercel](https://vercel.com).

---

## 🧩 Table of Contents

- [Features](#-features)
  - [Authentication](#authentication)
  - [Dashboard](#dashboard)
  - [Slide Editing](#slide-editing)
  - [Element Management](#element-management)
  - [Advanced UI Features](#advanced-ui-features)
- [Testing](#-testing)
- [Linting](#-linting)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Resources](#-resources)
- [License](#-license)

---

## ✨ Features

### Authentication

- ✅ **Landing Page** (`/`)

  - Welcome screen with login/register options.

- ✅ **Login** (`/login`)

  - Email + password input.
  - Submit via button or enter key.
  - Error messages on invalid login.

- ✅ **Register** (`/register`)

  - Email, password, name, and password confirmation.
  - Validation for matching passwords and registration errors.

- ✅ **Logout**
  - Available on all authenticated pages.
  - Returns user to the landing page.

---

### Dashboard

- ✅ **Dashboard Page** (`/dashboard`)

  - Lists all user presentations as cards in a responsive grid.
  - Each card shows: title, description, thumbnail, and number of slides.

- ✅ **New Presentation Creation**

  - Modal input for title, description, and thumbnail.
  - Automatically creates a presentation with a default empty slide.

- ✅ **View/Edit Presentation**

  - Route: `/presentation/:id/slide/:slideNum`
  - Slide viewer/editor with persistent navigation and controls.

- ✅ **Delete Presentation**

  - Modal confirmation required.
  - Deletes and returns to dashboard.

- ✅ **Edit Title & Thumbnail**
  - Accessible in presentation editor via modal.

---

### Slide Editing

- ✅ **Slide Navigation**

  - Add slides.
  - Navigate with left/right buttons and arrow keys.
  - Slide arrows disabled appropriately at ends.

- ✅ **Slide Deletion**

  - Cannot delete the last remaining slide.
  - Error message shown when attempting to.

- ✅ **Slide Numbering**
  - Visible in bottom-left of slide (within a 50x50 px box).

---

### Element Management

Each element can be:

- Added via modals.
- Double-clicked to edit.
- Right-clicked to delete.

#### Supported Elements:

- ✅ **Text**

  - Size (%), content, font size (`em`), HEX color.
  - Left-aligned, text overflows clipped.
  - Soft grey border shown.

- ✅ **Image**

  - Size (%), Base64 upload or URL, `alt` description.

- ✅ **Video**

  - Size (%), YouTube embed URL, autoplay toggle.

- ✅ **Code Block**
  - Size (%), code content, font size.
  - Automatic syntax highlighting for:
    - C
    - Python
    - JavaScript

---

### Advanced UI Features

> 🧑‍🤝‍🧑 Pair-only features (🙉)

- 🙉 **Element Drag & Drop**

  - Move elements within the slide using corner handles.
  - Position editing via modal removed.

- 🙉 **Element Resizing**

  - Resize with corner handles.
  - Constraints: Minimum 1% size, stay within slide bounds.

- ✅ **Font Customization**

  - Choose from at least 3 font families.
  - Can be per element, per slide, or per presentation.

- ✅ **Themes & Backgrounds**

  - Choose solid color, gradient, or image.
  - Slide-specific background overrides global default.

- ✅ **Preview Mode**

  - Opens in new tab, fullscreen presentation view.
  - Navigation + slide numbers visible.
  - Borders removed.

- ✅ **URL Persistence**

  - Slide number included in URL for direct linking and page refresh retention.

- 🙉 **Slide Transitions**

  - Includes animation (e.g., fade, swipe) between slides.

- 🙉 **Slide Rearranging**

  - Drag-and-drop reordering screen with slide numbers.
  - Close button to return.

- 🙉 **Revision History**
  - Auto-saves every 60 seconds.
  - List of saved versions with restore functionality.

---

## 🧪 Testing

### Component Testing (via Vitest)

- ✅ Solo: 3+ components tested
- ✅ Pair: 6+ components tested
- Good test **coverage**, **clarity**, and **design**.
- Test common components like:
  - Buttons
  - Dialogs
  - Card renderers

### UI Testing (via Cypress)

- ✅ Admin "Happy Path":

  1. Register
  2. Create presentation
  3. Edit thumbnail/title
  4. Add slides
  5. Navigate slides
  6. Delete presentation
  7. Logout & login again

- 🙉 Pair: Additional unique test path documented in `TESTING.md`

```bash
npm run test         # Runs Vitest + Cypress
npm run lint         # Runs ESLint
```

### Tech Stack

**Framework**
ReactJS (SPA)

**Styling**
Material UI + CSS

**Routing**
React Router

**Testing**
Vitest + Cypress

**Deployment**
Vercel

**Backend**
RESTful API (provided)

## License

This project was developed as part of COMP6080 at UNSW and is intended for educational purposes only.

## Acknowledgments

This project was inspired by slides.com and the COMP6080 course at UNSW.
