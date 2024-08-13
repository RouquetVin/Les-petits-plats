import { CardTemplate } from '../templates/card.js';
import { recipes } from '../../data/recipes.js';

// Create the MenuApp class to manage the display of recipes
class MenuApp {
	constructor() {
		this.recipes = recipes;
		this.menusSection = document.querySelector('.menus_section');
		this.menusTemplate = new CardTemplate();
		this.searchInput = document.querySelector('#search');
		this.clearInputButton =
			document.querySelector('.clear-input');
		this.recipesCountElement = document.querySelector(
			'main .section_btns_search h2',
		);
		this.main = document.querySelector('main');
	}

	// Method to display all recipes
	displayAllRecipes(recipesToDisplay = this.recipes) {
		this.clearMenusSection();
		this.removeNoRecipesMessage();
		if (recipesToDisplay.length > 0) {
			this.menusSection.classList.remove('empty');
			for (let i = 0; i < recipesToDisplay.length; i++) {
				this.menusSection.appendChild(
					this.menusTemplate.getMenuCardDom(
						recipesToDisplay[i],
					),
				);
			}
		} else {
			this.displayNoRecipesMessage(this.searchInput.value);
		}
		this.updateRecipesCount(recipesToDisplay.length);
	}

	// Method to display a message when no recipes are found
	displayNoRecipesMessage(query) {
		this.clearMenusSection();
		const message = document.createElement('div');
		message.classList.add('no-recipes-message');
		message.textContent = `Aucune recette ne contient ‘${query}’. Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
		this.main.appendChild(message);
	}

	// Method to remove the "no recipes found" message from the DOM if it exists.
	removeNoRecipesMessage() {
		const message = this.main.querySelector(
			'.no-recipes-message',
		);
		if (message) {
			message.remove();
		}
	}

	// Method to filter recipes based on user input
	filterRecipes(inputUser) {
		inputUser = inputUser.toLowerCase();
		let tableau = [];

		if (inputUser.length < 3) {
			// Return all recipes if the input length is less than 3
			return this.recipes;
		}

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

		return tableau;
	}

	// Method to handle the search
	handleSearch() {
		const query = this.searchInput.value;
		const filteredRecipes = this.filterRecipes(query);
		this.displayAllRecipes(filteredRecipes);
		this.toggleClearButton();
	}

	// Method to update the number of recipes displayed
	updateRecipesCount(count) {
		if (count === 0) {
			this.recipesCountElement.textContent = `0 recette`;
		} else if (count === 1) {
			this.recipesCountElement.textContent = `1 recette`;
		} else if (count === 50) {
			this.recipesCountElement.textContent = `1500 recettes`;
		} else {
			this.recipesCountElement.textContent = `${count} recettes`;
		}
	}

	// Clear the menus section
	clearMenusSection() {
		this.menusSection.textContent = '';
		this.menusSection.classList.add('empty');
	}

	// Toggle the visibility of the clear input button
	toggleClearButton() {
		if (this.searchInput.value.length > 0) {
			this.clearInputButton.style.display = 'block';
		} else {
			this.clearInputButton.style.display = 'none';
		}
	}

	// Clear the input field when the clear button is clicked
	clearInput() {
		this.searchInput.value = '';
		this.clearInputButton.style.display = 'none';
		this.displayAllRecipes();
	}

	// Initialization method to start the application
	init() {
		this.displayAllRecipes();
		this.searchInput.addEventListener('input', () =>
			this.handleSearch(),
		);
		this.clearInputButton.addEventListener('click', () =>
			this.clearInput(),
		);
	}
}

// Execute the code when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	const app = new MenuApp();
	app.init();
});
