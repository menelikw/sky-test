describe('Now TV movie listing', function() {

	var listings, search, deadSearch, ngHideCls;

	deadSearch = '-!@£$%^&*';
	//We also use 'ng-hide-animate' so must check for ng-hide at the END of the string (where it is dynamically added)
	ngHideCls = /ng-hide$/;

	browser.get( 'http://0.0.0.0:3000/'	);
	//Wait for angular manual bootstrapping
	browser.waitForAngular();

	beforeEach(function() {
		//assign common elements
		listings = element.all(by.repeater('movie in movieListings'));
		search = element.all(by.model('search'));
	});



	it('should be ordered by title and limited to 20', function() {
		//hmmm - bit of a rigid check
		listings.all(by.tagName('td')).then(function(elm) {
			expect(elm[0].getText()).toBe('2 Days in the Valley');
		});
		expect(listings.count()).toBe(20);
	});

	it('should list: title, year, rating, duration and actors', function() {
		/*
			A loose check to see all fields are present. Would still require human eyes
			to check for data integrity
		*/
		listings.get(0).all(by.tagName('td')).then(function(elm) {
			expect(elm.length).toBe(5);
		});
	});

	describe('Now TV movie listing messaging', function() {
		var resultCount = $('.nt_result-count'),
			message = $('.nt_no-items');

		it('should show result count when matches are found', function() {
			search.sendKeys('28 Days Later').then(function() {
				expect(resultCount.getAttribute('class')).not.toMatch(ngHideCls);
				search.clear();
			});
		});

		it('should hide result count when no matches are found', function() {
			search.sendKeys(deadSearch).then(function() {
				expect(resultCount.getAttribute('class')).toMatch(ngHideCls);
				search.clear();
			});
		});

		it('should show correct result count when matches are found', function() {
			//Searching for 'Later' just because it returns more than 1 result
			search.sendKeys('Later').then(function() {
				listings.count().then(function(count) {
					var regex = new RegExp('Matched ' + count + ' of \\d+ movies total');
					expect(resultCount.getText()).toMatch(regex);
					search.clear();
				});
			});
		});

		it('should hide "no results" message when view loads', function() {
			//Should be hidden on load
			expect(message.getAttribute('class')).toMatch(ngHideCls);
		});

		it('should show "no results" message when no matches found', function() {
			search.sendKeys(deadSearch).then(function() {
				expect(message.getAttribute('class')).not.toMatch(ngHideCls);
				search.clear();			
			});
		});

		it('should hide "no results" message when matches found', function() {
			search.sendKeys('25th').then(function() {
				expect(message.getAttribute('class')).toMatch(ngHideCls);
				search.clear();
			});
		});

	});

	describe('Now TV movie listing search', function() {
		var prompt = $('.nt_search-prompt');

		it('should be case sensitive', function() {
			//Lowercase search should be fruitless
			search.sendKeys('25th hour');
			expect(listings.count()).toBe(0);
			search.clear();

			//Correct casing should return a result
			search.sendKeys('25th Hour');
			expect(listings.count()).toBe(1);
			search.clear();
		});

		it('should hide prompt when view loads / input is empty', function() {
			expect(prompt.isDisplayed()).toBe(false);
		});

		it('should hide prompt when input contains 3 or more characters', function() {
			search.sendKeys('25t').then(function() {
				expect(prompt.getAttribute('class')).toMatch(ngHideCls);
				search.clear();			
			});
		});

		it('should show prompt when input contains < 3 characters', function() {
			search.sendKeys('25').then(function() {
				expect(prompt.getAttribute('class')).not.toMatch(ngHideCls);
				search.clear();			
			});

			search.sendKeys('2').then(function() {
				expect(prompt.getAttribute('class')).not.toMatch(ngHideCls);
				search.clear();
			});
		});

		it('should filter the list when search string contains 3 or more characters', function() {
			//A search with no results should have no listings
			search.sendKeys(deadSearch).then(function() {
				expect(listings.count()).toBe(0);			
				search.clear();
			});
			
			//A matched search should show a listing
			search.sendKeys('25th Hour').then(function() {
				expect(listings.count()).toBe(1);
				search.clear();			
			});
		});
	});

});