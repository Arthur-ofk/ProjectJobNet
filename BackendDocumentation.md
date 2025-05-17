# Backend API Documentation

## Overview
This document outlines the endpoints and models used in the backend. Each controller is listed with its routes, HTTP verbs, and associated request/response models.

---

## AuthController
- **POST** `/api/Auth/login`
  - **Request:** LoginDto
  - **Response:** AuthResponseDTO; returns unauthorized with error message for invalid credentials.
- **POST** `/api/Auth/register`
  - **Request:** RegisterDto
  - **Response:** AuthResponseDTO; returns error message on failure.

---

## UserController
- **GET** `/api/users` (AllowAnonymous)
  - **Response:** IEnumerable<UserDto>
- **GET** `/api/users/{id}` (AllowAnonymous)
  - **Response:** UserDto or 404 if not found.
- **POST** `/api/users`
  - **Request:** CreateUserDto
  - **Response:** Created resource
- **PUT** `/api/users/{id}`
  - **Request:** UpdateUserDto
  - **Response:** NoContent
- **DELETE** `/api/users/{id}`
  - **Response:** NoContent
- **GET** `/search/{searchParam}/{value}` (AllowAnonymous)
  - **Response:** IEnumerable<UserDto> filtered by parameter

---

## SubscriptionPlanController
- **GET** `/api/SubscriptionPlan` 
  - **Response:** IEnumerable<SubscriptionPlanDto>
- **GET** `/api/SubscriptionPlan/{id}`
  - **Response:** SubscriptionPlanDto or 404
- **POST** `/api/SubscriptionPlan`
  - **Request:** CreateSubscriptionPlanDto
  - **Response:** OK (or created resource)
- **PUT** `/api/SubscriptionPlan/{id}`
  - **Request:** CreateSubscriptionPlanDto (for update)
  - **Response:** NoContent
- **DELETE** `/api/SubscriptionPlan/{id}`
  - **Response:** NoContent

---

## SubscriptionController
- **GET** `/api/Subscription`
  - **Response:** IEnumerable<SubscriptionDto>
- **GET** `/api/Subscription/{id}`
  - **Response:** SubscriptionDto or 404
- **POST** `/api/Subscription`
  - **Request:** CreateSubscriptionDto
  - **Response:** Created resource
- **PUT** `/api/Subscription/{id}`
  - **Request:** CreateSubscriptionDto (for update)
  - **Response:** NoContent
- **DELETE** `/api/Subscription/{id}`
  - **Response:** NoContent

---

## ServiceController
- **GET** `/api/services` (AllowAnonymous)
  - **Response:** IEnumerable<ServiceDto>
- **GET** `/api/services/{id}` (AllowAnonymous)
  - **Response:** ServiceDto or 404
- **POST** `/api/services`
  - **Request:** CreateServiceDto
    - **Fields:** 
      - `userId` (Guid, required)
      - `categoryId` (Guid, required)
      - `serviceName` (string, required)
      - `description` (string, required)
      - `price` (decimal, required)
      - `upvotes` (int, optional)
      - `downvotes` (int, optional)
  - **Response:** OK
- **PUT** `/api/services/{id}`
  - **Request:** CreateServiceDto (for update)
  - **Response:** NoContent
- **DELETE** `/api/services/{id}`
  - **Response:** NoContent

---

## SavedJobController
- **GET** `/api/SavedJob`
  - **Response:** IEnumerable<SavedJobDto>
- **POST** `/api/SavedJob`
  - **Request:** CreateSavedJobDto
  - **Response:** OK
- **DELETE** `/api/SavedJob?employerId={employerId}&jobId={jobId}`
  - **Response:** NoContent

---

## RoleController
- **GET** `/api/roles`
  - **Response:** IEnumerable<RoleDto>
- **GET** `/api/roles/{id}`
  - **Response:** RoleDto or 404
- **POST** `/api/roles`
  - **Request:** CreateRoleDto
  - **Response:** Created resource
- **PUT** `/api/roles/{id}`
  - **Request:** UpdateRoleDto
  - **Response:** NoContent
- **DELETE** `/api/roles/{id}`
  - **Response:** NoContent

---

## ReviewController
- **GET** `/api/Review` (AllowAnonymous)
  - **Response:** IEnumerable<ReviewDto>
- **GET** `/api/Review/{id}` (AllowAnonymous)
  - **Response:** ReviewDto or 404
- **POST** `/api/Review`
  - **Request:** CreateReviewDto
  - **Response:** OK
- **PUT** `/api/Review/{id}`
  - **Request:** UpdateReviewDto
  - **Response:** NoContent
- **DELETE** `/api/Review/{id}`
  - **Response:** NoContent

---

## ResumeController
- **GET** `/api/resumes` (AllowAnonymous)
  - **Response:** IEnumerable<ResumeDto>
- **GET** `/api/resumes/{id}` (AllowAnonymous)
  - **Response:** ResumeDto or 404
- **POST** `/api/resumes`
  - **Request:** CreateResumeDto
  - **Response:** OK
- **PUT** `/api/resumes/{id}`
  - **Request:** CreateResumeDto (for update)
  - **Response:** NoContent
- **DELETE** `/api/resumes/{id}`
  - **Response:** NoContent

---

## LikedPostController
- **GET** `/api/likedposts`
  - **Response:** IEnumerable<LikedPostDto>
- **POST** `/api/likedposts`
  - **Request:** CreateLikedPostDto
  - **Response:** OK
- **DELETE** `/api/likedposts?userId={userId}&postId={postId}`
  - **Response:** NoContent

---

## JobController
- **GET** `/api/jobs` (AllowAnonymous)
  - **Response:** IEnumerable<JobDto>
- **GET** `/api/jobs/{id}` (AllowAnonymous)
  - **Response:** JobDto or 404
- **POST** `/api/jobs`
  - **Request:** CreateJobDto
  - **Response:** Created resource
- **PUT** `/api/jobs/{id}`
  - **Request:** UpdateJobDto
  - **Response:** NoContent
- **DELETE** `/api/jobs/{id}`
  - **Response:** NoContent

---

## ComplaintController
- **GET** `/api/complaints`
  - **Response:** IEnumerable<ComplaintDto>
- **GET** `/api/complaints/{id}`
  - **Response:** ComplaintDto or 404
- **POST** `/api/complaints`
  - **Request:** CreateComplaintDto
  - **Response:** Created resource
- **PUT** `/api/complaints/{id}`
  - **Request:** UpdateComplaintDto
  - **Response:** NoContent
- **DELETE** `/api/complaints/{id}`
  - **Response:** NoContent

---

## CategoryController
- **GET** `/api/categories` (AllowAnonymous)
  - **Response:** IEnumerable<CategoryDto>
- **GET** `/api/categories/{id}` (AllowAnonymous)
  - **Response:** CategoryDto or 404
- **POST** `/api/categories`
  - **Request:** CreateCategoryDto
  - **Response:** Created resource
- **PUT** `/api/categories/{id}`
  - **Request:** UpdateCategoryDto
  - **Response:** NoContent
- **DELETE** `/api/categories/{id}`
  - **Response:** NoContent
- **GET** `/searchCategories/{paramName}/{value}` (AllowAnonymous)
  - **Response:** IEnumerable<CategoryDto> filtered by parameter

---

## BlogPostController
- **GET** `/api/posts` (AllowAnonymous)
  - **Response:** IEnumerable<BlogPostDto>
- **GET** `/api/posts/{id}` (AllowAnonymous)
  - **Response:** BlogPostDto or 404
- **POST** `/api/posts`
  - **Request:** CreateBlogPostDto
  - **Response:** Created resource
- **PUT** `/api/posts/{id}`
  - **Request:** UpdateBlogPostDto
  - **Response:** NoContent
- **DELETE** `/api/posts/{id}`
  - **Response:** NoContent
- **GET** `/BlogPost/paged?skip={skip}&take={take}` (AllowAnonymous)
  - **Response:** IEnumerable<BlogPostDto>
  - **Usage:** Dynamically load posts using paging parameters (skip and take)

## BlogPost Extra Entities
- **BlogPostVotes**
  - Created via repository/service calls using IBlogPostVoteService.
- **PostComments**
  - Handled via IPostCommentService.
- **SavedBlogPosts**
  - Managed via ISavedBlogPostService.

---

## Models Overview
Below are some of the key Data Transfer Objects (DTOs) referenced within the endpoints:
- **User Models:** UserDto, CreateUserDto, UpdateUserDto  
- **Auth Models:** LoginDto, RegisterDto, AuthResponseDTO  
- **SubscriptionPlan Models:** SubscriptionPlanDto, CreateSubscriptionPlanDto  
- **Subscription Models:** SubscriptionDto, CreateSubscriptionDto  
- **Service Models:** ServiceDto, CreateServiceDto  
- **SavedJob Models:** SavedJobDto, CreateSavedJobDto  
- **Role Models:** RoleDto, CreateRoleDto, UpdateRoleDto  
- **Review Models:** ReviewDto, CreateReviewDto, UpdateReviewDto  
- **Resume Models:** ResumeDto, CreateResumeDto  
- **LikedPost Models:** LikedPostDto, CreateLikedPostDto  
- **Job Models:** JobDto, CreateJobDto, UpdateJobDto  
- **Complaint Models:** ComplaintDto, CreateComplaintDto, UpdateComplaintDto  
- **Category Models:** CategoryDto, CreateCategoryDto, UpdateCategoryDto  
- **BlogPost Models:** BlogPostDto, CreateBlogPostDto, UpdateBlogPostDto  

This documentation comprises an analysis of the available endpoints and data models. Further details (e.g., field definitions and validations) can be extracted from the source code and mapping profiles if needed.
