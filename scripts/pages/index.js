import { CardTemplate } from '../templates/card.js';
import { recipes } from '../../data/recipes.js';

// Create the MenuApp class to manage the display of recipes
class MenuApp {
	constructor() {
		this.recipes = recipes;
		this.menusSection = document.querySelector('.menus_section');
		this.menusTemplate = new CardTemplate();
		this.searchInput = document.querySelector('#search');
		this.searchButton = document.querySelector(
			'.icone_search_background',
		);
	}

	// Method to display all recipes
	displayAllRecipes(recipesToDisplay = this.recipes) {
		this.menusSection.innerHTML = '';
		for (let i = 0; i < recipesToDisplay.length; i++) {
			this.menusSection.appendChild(
				this.menusTemplate.getMenuCardDom(
					recipesToDisplay[i],
				),
			);
		}
	}

	// Method to filter recipes based on user input
	filterRecipes(inputUser) {
		inputUser = inputUser.toLowerCase();
		let tableau = [];
		if (inputUser.length >= 3) {
			for (let i = 0; i < this.recipes.length; i++) {
				let found = false;
				if (
					this.recipes[i].name
						.toLowerCase()
						.includes(inputUser) ||
					this.recipes[i].description
						.toLowerCase()
						.includes(inputUser)
				) {
					tableau.push(this.recipes[i]);
					found = true;
				}
				if (!found) {
					for (
						let j = 0;
						j < this.recipes[i].ingredients.length;
						j++
					) {
						if (
							this.recipes[i].ingredients[j].ingredient
								.toLowerCase()
								.includes(inputUser)
						) {
							tableau.push(this.recipes[i]);
							break;
						}
					}
				}
			}
		}
		return tableau;
	}

	// Method to handle the search
	handleSearch() {
		const query = this.searchInput.value;
		const filteredRecipes = this.filterRecipes(query);
		this.displayAllRecipes(filteredRecipes);
	}

	// Initialization method to start the application
	init() {
		this.displayAllRecipes();
		this.searchButton.addEventListener('click', () =>
			this.handleSearch(),
		);
	}
}

// Execute the code when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	const app = new MenuApp();
	app.init();
});
