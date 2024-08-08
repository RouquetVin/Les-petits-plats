import { CardTemplate } from '../templates/card.js';
import { recipes } from '../../data/recipes.js';

// Create the MenuApp class to manage the display of recipes
class MenuApp {
	constructor() {
		this.recipes = recipes;
		this.menusSection = document.querySelector('.menus_section');
		this.menusTemplate = new CardTemplate();
	}

	// Method to display all recipes
	displayAllRecipes() {
		for (let i = 0; i < this.recipes.length; i++) {
			this.menusSection.appendChild(
				this.menusTemplate.getMenuCardDom(this.recipes[i]),
			);
		}
	}

	// Initialization method to start the application
	init() {
		this.displayAllRecipes();
	}
}

// Execute the code when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	const app = new MenuApp();
	app.init();
});
