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
