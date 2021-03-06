$(document).ready(function() {
  $('#new-tweet-button').on('submit', function(event) {//Creates 'create tweet box'
    event.preventDefault();
    if (!$(".new-tweet").is(":visible")) {
      $(".new-tweet").slideDown();
      $("#tweet-text").focus();
    } else {
      $(".new-tweet").slideUp();
    }
  }),

  $('#submit-button').on('submit', function(event) {
    event.preventDefault();
    if ($('.counter').val() < 0) {//Checks if tweet is too long
      $('.errorText').remove();
      const $error = $(`<label class="errorText">Your Tweet is too long.</label>`);
      $('#error').append($error);
      $('.errorText').slideDown();
      return false;
    }
    if ($('#tweet-text').val() === "") {//Checks if tweet is empty
      $('.errorText').remove();
      const $error = $(`<label class="errorText">Your Tweet is empty.</label>`);
      $("#error").append($error);
      $(".errorText").slideDown();
      return false;
    }
    if ($('#tweet-text').val() === null) {//Checks if tweet is null
      $(".errorText").remove();
      const $error = $(`<label class="errorText">Your Tweet is null.</label>`);
      $('#error').append($error);
      $('.errorText').slideDown();
      return false;
    }

    const myData = $(this).serialize();
    $('.errorText').remove();//Removes any error messages
    $.ajax({
      url: '/tweets',
      type: 'POST',
      data: myData,
      success: function(data) {
        $('#tweet-text').val('');//Clears new tweet box
        $('.counter').val(140);
        loadTweets();
        return data;
      }
    });
  });

  //Ajax get request to fetch all the tweets from /tweets
  const loadTweets = function() {
    $.ajax('/tweets', { method: 'GET' })
      .then(function(tweets) {
        renderTweets(tweets);
      });
  };
  loadTweets();
});


//Creates tweet elements dynamically from tweet object
const createTweetElement = function(data) {
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
      ${`${escape(data.content.text)}`}
    </label>
    <footer>
      <label class="daysAgo">${date}</label>
      <label class="icons">🏴 🔁 🖤</label>
    </footer>
  </article>
  <br>
  `);
  return $tweet;
};


const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


//Uses createTweetElements function to display tweets from array of tweet objects
const renderTweets = function(tweets) {
  $('.tweet-container').empty();//Empties container to ensure duplicate tweets are not posted
  for (tweetItem of tweets) {
    const $tweet = createTweetElement(tweetItem);
    $(".tweet-container").prepend($tweet);
  }
};