"use strict";

// Global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage($allStoriesList, storyList.stories);
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
  const $markUp = $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);

    if (currentUser) {
      $markUp.prepend(generateStar(story));
    }

  return $markUp;
}

function generateStar(story) {
  let starMarkup = "bi-star"; // default is not filled
  if (currentUser.checkIfStoryInUserFavorites(story)) { // MOVE THIS TO USER METHOD
    starMarkup = "bi-star-fill"; // change to filled if favorite
  }

  return $(`<i class="bi ${starMarkup}"></i>`);
}

/**
 * updates the provided jquery object list with formatted stories in the
 * provided story list; posts a message instead if the passed list has no
 * stories in it
 * @param {jquery object} $displayList - jquery object where stories should go
 * @param {array} storyList - list of Story instances to be formatted
 */
function putStoriesOnPage($displayList, storyList, noStoryMessage="No stories found!") {
  console.debug("putStoriesOnPage");

  $displayList.empty();

  if (!storyList.length) {
    $displayList.text(noStoryMessage);
  }

  // loop through all of our stories and generate HTML for them
  for (let story of storyList) {
    const $story = generateStoryMarkup(story);
    $displayList.append($story);
  }

  $displayList.show();
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
 * adds a new favorite to API and loca storage if the provided id is not in the
 * current users favorites; removes an existing story from API and local storage
 * if the id is already in the favorites
 * @param {object} clickedStory - Story instance.
 */
async function addOrDeleteFavorite(clickedStory) {
  if (currentUser.checkIfStoryInUserFavorites(clickedStory)) {
    await currentUser.toggleFavoriteApi(clickedStory, "delete");
    currentUser.removeFavoriteLocal(clickedStory);
  } else {
    await currentUser.toggleFavoriteApi(clickedStory, "post");
    currentUser.addFavoriteLocal(clickedStory);
  }
}

/**
 * finds and returns the story with the given id in the provided list
 * @param {array} list
 * @param {string} id
 * @returns story in list with the given id
 */
function findStoryAtId(list, id) {
  return list.find(story => story.storyId === id);
}

/**
 * controller function for star symbols listener; toggles the star between
 * filled/outlined and makes the appropriate post/delete API call and adjustments
 * to local favorites storage
 * @param {evt} evt
 */
async function toggleSymbolAndChangeFavorite(evt) {
  console.log("in the toggleSymbolAndChangeFavorite function")
  const $star = $(evt.target);
  const clickedStoryId = $star.parent().attr("id");
  const clickedStory = findStoryAtId(storyList.stories, clickedStoryId);

  try {
    await addOrDeleteFavorite(clickedStory);

  } catch(err) {
    return
  }

  toggleStar($star);
}

$allStoriesContainer.on('click', "i", toggleSymbolAndChangeFavorite);