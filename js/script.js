$(function() {
	var $btn = $('#search');
	var $main = $('main');
	var numPhotos = 4;

	var url = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"; 
	var searchPhotos = {
		format: 'json'
	};

	$btn.click(function(e) {
		e.preventDefault();
		var $tag = $('#userTag');
		if ($tag.val() == '') {
			return;
		}

		searchPhotos.tags = $tag.val();
		createGallery();

		$.getJSON(url, searchPhotos, function(data) {
			$('h2:first').text('Tag: ' + searchPhotos.tags);
			$.each(data.items, function(i, photo) {
				if(i < numPhotos) {
					var photos = '<li><a href="' + photo.link + '" target="_blank"><img class="card" date-published="' + photo.published;
					photos += '" date-taken="' + photo.date_taken + '" src="' + photo.media.m + '"</a></li>';
					$('.imgBox:first').append(photos);
				};
			});
		});
		toSort();
		removeGallery();
		$tag.val('');
	});

	function createGallery() {
		var $gallery = $('<div>');
		var $heading = $('<h2>');
		var $sort = $('<p>Sort by: <a href="#" class="published">date published</a> | <a href="#" class="taken">date taken</a></p>');
		var $list = $('<ul>');
		var $del = $('<button>Delete gallery</button>');
		$list.attr('class', 'imgBox clearfix');
		$del.attr('id', 'delete').addClass('remove');
		$gallery.addClass('gallery').append($heading).append($sort);
		$list.append($list);
		$gallery.append($list).append($del);
		$main.prepend($gallery);
	};

	function removeGallery() {
		$('#delete').click(function(e) {
			e.preventDefault();
			$(this).closest('.gallery').animate({
				opacity: 0
			}, 500, function() {
				$(this).closest('.gallery').remove();
			});
		});
	};

	function toSort() {
		$('.published').click(function(e) {
			e.preventDefault();
			var $target = $(this);
			var arr = [];
			var placeholder;
			var $newList = $target.closest('.gallery').children('.imgBox');
			(function() {
				var images = $newList.find('img.card');
				images.each(function() {
					arr.push($(this).attr('date-published'));
				});
				var sorted = arr.sort().reverse();
				for (var i = 0; i < numPhotos; i ++) {
					placeholder = sorted[i];
					images.each(function() {
						if($(this).attr('date-published') == placeholder) {
							$newList.append($(this).closest('li'));
						}
					});
				}
			}) ();
		});

		$('.taken').click(function(e) {
			e.preventDefault();
			var $target = $(this);
			var arr = [];
			var placeholder;
			var $newList = $target.closest('.gallery').children('.imgBox');
			(function() {
				var images = $newList.find('img.card');
				images.each(function() {
					arr.push($(this).attr('date-taken'));
				});
				var sorted = arr.sort().reverse();

				for (var i = 0; i < numPhotos; i ++) {
					placeholder = sorted[i];
					images.each(function() {
						if($(this).attr('date-taken') == placeholder) {
							$newList.append($(this).closest('li'));
						}
					});
				}
			}) ();
		});
	};
});