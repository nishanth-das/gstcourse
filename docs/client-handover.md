# GSTCourses.in - Admin Handover Guide

Welcome to your new e-learning platform! This guide will explain how you can manage your website, courses, students, and settings day-to-day. You don't need any technical knowledge to operate the site—everything can be done directly from the Admin Panel.

---

## 1. Accessing the Admin Panel

1. Go to your website (e.g., `https://gstcourse.in/login`).
2. Log in using your **Admin Email** and Password.
3. Once logged in, click your name/avatar in the top right corner.
4. Select **Admin Panel** from the dropdown menu.

*(Note: Normal students will not see the Admin Panel option, only you can see it).*

---

## 2. Managing the Course Catalog

### Creating a Course Category
Before creating a course, it helps to categorize it (e.g., "Taxation", "Accounting").
1. Go to **Admin Panel > Categories**.
2. Click **+ New Category**.
3. Enter a Name and an optional URL Slug (e.g., `accounting`). 

### Creating a Course
1. Go to **Admin Panel > Courses**.
2. Click **+ New Course**.
3. Fill in the details:
   - **Title**: The name of the course.
   - **Description**: A full description (supports text formatting).
   - **Price**: Your selling price (in ₹).
   - **Compare-at Price**: (Optional) A higher price that will be crossed out to show a discount (e.g., Price: 4999, Compare-at: 9999).
   - **Thumbnail**: Upload an attractive cover image (Recommended: 1280x720px, 16:9 ratio).
4. **Publishing**: Set the status to `Published` when you want it to appear on the public website, or `Draft` to hide it.

### Deleting a Course
1. In **Admin Panel > Courses**, click the red **Delete** button next to a course.
2. *Important:* You cannot delete a course if students have already purchased it! If you want to hide an active course from new buyers, simply click Edit and change its status to **Draft**.

---

## 3. Adding Lessons & Videos

Once a course is created, you need to add your video content.

1. Go to **Admin Panel > Courses** and click **Curriculum** next to the course.
2. **Create a Module**: Modules act as folders or sections (e.g., "Module 1: Basics of GST").
3. **Add a Lesson**: Click "+ New Lesson" inside a module.
4. **YouTube Videos**:
   - Upload your video to YouTube and set it to **"Unlisted"** (so people can't find it on YouTube directly).
   - Copy the video URL.
   - In the lesson form, choose **"YouTube"** as the Video Provider.
   - Paste the URL (e.g., `https://youtube.com/watch?v=YOUR_VIDEO_ID`).
5. **Study Materials (PDFs)**:
   - Scroll down to "Lesson Materials" while editing a lesson.
   - You can upload PDFs or DOC files here. These files are securely locked and can only be downloaded by paying students!
6. **Free Preview**: Check the "Is Free Preview?" box if you want anyone (even non-paying visitors) to watch this specific lesson as a teaser.

---

## 4. Writing Blog Posts

Blogging helps your website rank on Google.

1. Go to **Admin Panel > Blog Posts**.
2. Click **+ New Post**.
3. **Cover Image**: Upload a high-quality cover image (Recommended: 1200x630px). Our system will automatically compress it to make your site load faster.
4. **SEO Information**:
   - Be sure to fill out the **Meta Title** and **Meta Description** at the bottom of the page. This is what shows up on Google Search results!

---

## 5. Discount Coupons

1. Go to **Admin Panel > Coupons**.
2. Click **+ New Coupon**.
3. Enter a code (e.g., `DIWALI50`).
4. Choose the discount type (`percentage` or `fixed amount`).
5. Set the discount value (e.g., `50` for 50%).
6. Set an Expiry Date (optional).
7. Students can enter this code on the Checkout page to get an instant discount.

---

## 6. Managing Students & Orders

- **Students Page**: See everyone who has registered on your site. You can easily see how many courses they are enrolled in.
- **Orders Page**: View all successful transactions, how much was paid, and which coupon was used. 

---

## 7. Customizing Site Content (Settings)

You can change the text on your website without writing any code!
1. Go to **Admin Panel > Settings**.
2. **Hero Section**: Change the big text on the home page (Title, Subtitle, and Call to Action button link).
3. **Trust Stats**: Update the numbers showing on your site (e.g., "10,000+ Students", "50+ Courses").
4. **About Page**: Write your company's story.
5. **Contact Info**: Update the email address, phone number, and physical address shown on the Contact page.

---

## 8. Technical Support

If you ever need a new feature, a design change, or encounter a technical problem that you cannot fix from the Admin Panel, please reach out to your developer (me!). 

The site is built on modern, scalable technology (Next.js, Supabase, Razorpay) and is designed to handle thousands of concurrent students seamlessly. Good luck with your launch!
