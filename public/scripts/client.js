/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function(){
  $('#submit-button').on('submit', function(event) {
    event.preventDefault();
    console.log($('.counter').val())
    if ($('.counter').val() < 0) {
      $( ".errorText" ).remove();
      const $error = $(`<label class="errorText">Your Tweet is too long.</label>`);
      $("#error").append($error);
      $(".errorText").slideDown();
      return false;
    }
    if ($('#tweet-text').val() === "") {
      $( ".errorText" ).remove();
      const $error = $(`<label class="errorText">Your Tweet is empty.</label>`);
      $("#error").append($error);
      $(".errorText").slideDown();
      return false;
    }
    if ($('#tweet-text').val() === null) {
      $( ".errorText" ).remove();
      const $error = $(`<label class="errorText">Your Tweet is null.</label>`);
      $("#error").append($error);
      $(".errorText").slideDown();
      return false;
    }
    const myData = $(this).serialize();
    $( ".errorText" ).remove();
    $.ajax({
      url: '/tweets',
      type: 'POST',
      data: myData,
      success: function(data) {
        $('#tweet-text').val('');
        $('.counter').val(140);
        loadTweets();
        return data;
      }
    });
  });

  const loadTweets = function (){
    $.ajax('/tweets', { method: 'GET' })
    .then(function (tweets) {
      renderTweets(tweets);
    });
  };
  loadTweets();
});



const createTweetElement = function (data) {
  const date = new Date(0);
  date.setUTCMilliseconds(data.created_at);
  const $tweet = $(`
  <article>
    <header>
      <div class="displayAvatar">
        <img class="tweetImage" src=${data.user.avatars}>
        <label class="name">${data.user.name}</label>
      </div>
      <div class = "handle">
        <label>${data.user.handle}</label>
      </div>
    </header>
    <label class="tweetContent" for="tweets">
      ${data.content.text}
    </label>
    <footer>
      <label class="daysAgo">${date}</label>
      <label class="icons">🏴 🔁 🖤</label>
    </footer>
  </article>
  <br>
`);
return $tweet;
}

const renderTweets = function(tweets) {
  $('.tweet-container').empty()
  for (tweetItem of tweets) {
    const $tweet = createTweetElement(tweetItem);
    $(".tweet-container").prepend($tweet);
  }
}