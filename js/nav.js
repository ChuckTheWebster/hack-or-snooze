"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage($allStoriesList, storyList.stories);
}

$body.on("click", "#nav-all", navAllStories);

/** show submit new story form */
function navSubmitLinkClick(evt) {
  evt.preventDefault();
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$submitLink.on("click", navSubmitLinkClick);

/** show list of user favorites */
function navFaveLinkClick(evt) {
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage($favoriteContainer, currentUser.favorites, "No favorites added!")
  $favoriteContainer.show();
}

$faveLink.on("click", navFaveLinkClick);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
