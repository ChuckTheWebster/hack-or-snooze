"use strict";

// Global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="bi bi-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);

}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/**
 * Collects data from submit form and returns object of data.
 * @returns {object}
 */
function getSubmitFormData() {
  return {
    author: $authorInput.val(),
    title: $titleInput.val(),
    url: $urlInput.val()
  }
}

/**
 * Controller function to get submit form new story
 * input and prepend it to the top of the
 * story-list.
 */
async function getNewStoryAndAddToPage(evt) {
  evt.preventDefault();

  const submitFormData = getSubmitFormData();
  const newStory = await storyList.addStory(currentUser.username, submitFormData);
  const newStoryMarkup = generateStoryMarkup(newStory);

  $allStoriesList.prepend(newStoryMarkup);
  hidePageComponents();
  $allStoriesList.show();
}

$submitButton.on('click', getNewStoryAndAddToPage);

/**
 * takes the passed star jquery object and toggles it classes: filled to outlined
 * and outlined to filled
 * @param {jquery object} $star
 */
function toggleStar($star) {
  $star.toggleClass("bi-star").toggleClass("bi-star-fill");
}

/**
 * adds a new favorite if the provided id is not in the current users favorites;
 * removes an existing story if the id is already in the favorites
 * @param {string} id - story id
 */
function addOrDeleteFavorite(id) {
  console.log({currentUser});
  console.log(currentUser.favorites);
  if (currentUser.favorites.some(story => story.id === id)) {
    currentUser.removeFavoriteApi(id);
  } else {
    currentUser.addFavoriteApi(id);
  }
  // check if currently in favorites
  //
  // we stopped here - figure out how to loop through favorites and see if
  // the passed id is included in any of the stories in favorites
  //
  console.log(currentUser.favorites);
  // if it is, remove it from local array and make "remove" API call
  // if it isn't, add it to local array and make "add" API call

}
/**
 * controller function for star symbols listener; toggles the star between
 * filled/outlined and makes the appropriate post/delete API call
 * @param {evt} evt
 */
function toggleSymbolAndChangeFavorite(evt) {
  evt.preventDefault();

  const $star = $(evt.target);
  toggleStar($star);
  const storyId = $star.parent().attr("id");
  addOrDeleteFavorite(storyId);
  // logic to determine if story should be added or removed
}


$allStoriesList.on('click', "i", toggleSymbolAndChangeFavorite);