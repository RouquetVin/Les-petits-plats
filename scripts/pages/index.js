import { CardTemplate } from '../templates/card.js';
import { recipes } from '../../data/recipes.js';

// Create the MenuApp class to manage the display of recipes
class MenuApp {
	constructor() {
		this.recipes = recipes;
		this.menusSection = document.querySelector('.menus_section');
		this.menusTemplate = new CardTemplate();
		this.searchInput = document.querySelector('#search');
		this.clearInputButton = document.querySelector('.clear-icon');
		this.recipesCountElement = document.querySelector(
			'main .section_btns_search h2',
		);
		this.main = document.querySelector('main');
		this.tagList = [];
		this.selectedTags = [];
		this.tagsContainer = document.querySelector('#selected-tags');
		this.ingredientsOptions = document.querySelector(
			'.ingredients-options',
		);
		this.appliancesOptions = document.querySelector(
			'.appliances-options',
		);
		this.ustensilsOptions = document.querySelector(
			'.ustensils-options',
		);
	}

	// Method to display recipes in the menu section
	renderRecipes(recipesToDisplay = this.recipes) {
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

	// Method to remove the "no recipes found" message from the DOM if it exists
	removeNoRecipesMessage() {
		const message = this.main.querySelector(
			'.no-recipes-message',
		);
		if (message) {
			message.remove();
		}
	}

	// Method to check if an ingredient matches a given string
	doesIngredientMatch(ingredients, query) {
		let match = false;
		ingredients.forEach((ingredientObj) => {
			if (
				ingredientObj.ingredient.toLowerCase().includes(query)
			) {
				match = true;
			}
		});
		return match;
	}

	// Method to filter recipes based on user search input
	filterBySearch(inputUser) {
		inputUser = inputUser.toLowerCase();

		if (inputUser.length < 3) {
			return this.recipes;
		}

		return this.recipes.filter((recipe) => {
			const matchesNameOrIngredient =
				recipe.name.toLowerCase().includes(inputUser) ||
				this.doesIngredientMatch(
					recipe.ingredients,
					inputUser,
				);

			if (!matchesNameOrIngredient) {
				return recipe.description
					.toLowerCase()
					.includes(inputUser);
			}

			return matchesNameOrIngredient;
		});
	}

	// Method to filter recipes based on selected tags
	filterByTags(recipes) {
		return recipes.filter((recipe) => {
			let matchesTags = true;

			this.selectedTags.forEach((tagObj) => {
				const tag = tagObj.tag.toLowerCase();
				const category = tagObj.category;

				let tagMatch = false;

				// Check if the tag matches an ingredient
				if (category === 'ingredient') {
					tagMatch = this.doesIngredientMatch(
						recipe.ingredients,
						tag,
					);
				}

				// Check if the tag matches an appliance
				if (category === 'appliance' && !tagMatch) {
					if (
						recipe.appliance.toLowerCase().includes(tag)
					) {
						tagMatch = true;
					}
				}

				// Check if the tag matches a utensil
				if (category === 'ustensils' && !tagMatch) {
					recipe.ustensils.forEach((ustensil) => {
						if (ustensil.toLowerCase().includes(tag)) {
							tagMatch = true;
						}
					});
				}

				if (!tagMatch) {
					matchesTags = false;
				}
			});

			return matchesTags;
		});
	}

	// Method to combine search and tag filters
	filterRecipes(inputUser = '') {
		let recipesAfterSearch = this.filterBySearch(inputUser);
		let finalFilteredRecipes = this.filterByTags(
			recipesAfterSearch,
		);
		return finalFilteredRecipes;
	}

	// Method to search, apply tag filters, and update the displayed recipes
	performSearch() {
		const query = this.searchInput.value;
		const filteredRecipes = this.filterRecipes(query);
		this.renderRecipes(filteredRecipes);
		this.toggleClearButton();
		this.updateFilterOptions(filteredRecipes);
	}

	// Method to update the number of recipes displayed
	updateRecipesCount(count) {
		if (count < 2) {
			this.recipesCountElement.textContent = `${count} recette`;
		} else {
			this.recipesCountElement.textContent = `${count} recettes`;
		}
	}

	// Method to clear the menu section
	clearMenusSection() {
		this.menusSection.textContent = '';
		this.menusSection.classList.add('empty');
	}

	// Method to show or hide the search clear button
	toggleClearButton() {
		if (this.searchInput.value.length > 0) {
			this.clearInputButton.style.display = 'block';
		} else {
			this.clearInputButton.style.display = 'none';
		}
	}

	// Method to clear the search input and reset the recipe display
	clearInput() {
		this.searchInput.value = '';
		this.clearInputButton.style.display = 'none';
		const filteredRecipes = this.filterRecipes();
		this.renderRecipes(filteredRecipes);
		this.updateFilterOptions(filteredRecipes);
	}

	// Method to capitalize the first letter of a string
	capitalizeFirstLetter(string) {
		return (
			string[0].toUpperCase() +
			string.substring(1).toLowerCase()
		);
	}

	// Method to add a tag to the selected tags list
	addTag(tag, category) {
		this.selectedTags.push({ tag, category });
		this.renderTags();
		this.performSearch();
	}

	// Method to remove a tag from the selected tags list
	removeTag(tagToRemove, category) {
		this.selectedTags = this.selectedTags.filter(
			(tag) =>
				tag.tag !== tagToRemove || tag.category !== category,
		);
		this.renderTags();
		this.performSearch();
	}

	// Method to display selected tags in the interface
	renderTags() {
		this.tagsContainer.innerHTML = '';
		for (let i = 0; i < this.selectedTags.length; i++) {
			const { tag, category } = this.selectedTags[i];

			const tagElement = document.createElement('span');
			tagElement.classList.add('tag');

			const tagText = document.createElement('span');
			tagText.textContent = this.capitalizeFirstLetter(tag);
			tagText.classList.add('tag-text');

			const removeIcon = document.createElement('i');
			removeIcon.classList.add('fa', 'fa-times', 'remove-icon');

			removeIcon.addEventListener('click', () => {
				this.removeTag(tag, category);
			});

			tagElement.appendChild(tagText);
			tagElement.appendChild(removeIcon);

			this.tagsContainer.appendChild(tagElement);
		}
	}

	// Method to update the filter options
	updateFilterOptions(recipes) {
		const uniqueIngredients = {};
		const uniqueAppliances = {};
		const uniqueUstensils = {};

		for (let i = 0; i < recipes.length; i++) {
			const recipe = recipes[i];

			for (let j = 0; j < recipe.ingredients.length; j++) {
				uniqueIngredients[
					recipe.ingredients[j].ingredient.toLowerCase()
				] = true;
			}
			uniqueAppliances[recipe.appliance.toLowerCase()] = true;

			for (let j = 0; j < recipe.ustensils.length; j++) {
				uniqueUstensils[
					recipe.ustensils[j].toLowerCase()
				] = true;
			}
		}

		this.renderFilterOptions(
			this.ingredientsOptions,
			uniqueIngredients,
			'ingredient',
		);
		this.renderFilterOptions(
			this.appliancesOptions,
			uniqueAppliances,
			'appliance',
		);
		this.renderFilterOptions(
			this.ustensilsOptions,
			uniqueUstensils,
			'ustensils',
		);
	}

	// Method to display available filter options
	renderFilterOptions(container, options, category) {
		container.innerHTML = '';

		const searchContainer = document.createElement('div');
		searchContainer.classList.add('search-container');

		const searchInput = document.createElement('input');
		searchInput.type = 'text';
		searchInput.classList.add('search-input');

		const searchIcon = document.createElement('i');
		searchIcon.classList.add('fa', 'fa-search', 'search-icon');

		const clearIcon = document.createElement('i');
		clearIcon.classList.add('fa', 'fa-times', 'clear-icon-tag');
		clearIcon.style.display = 'none';

		searchContainer.appendChild(searchInput);
		searchContainer.appendChild(searchIcon);
		searchContainer.appendChild(clearIcon);

		container.appendChild(searchContainer);

		const customOptionsContainer = document.createElement('ul');
		customOptionsContainer.classList.add(
			'custom-options-container',
		);

		for (const option in options) {
			if (
				option &&
				!this.selectedTags.some(
					(tag) =>
						tag.tag.toLowerCase() ===
							option.toLowerCase() &&
						tag.category === category,
				)
			) {
				const li = document.createElement('li');
				li.textContent = this.capitalizeFirstLetter(option);
				li.classList.add('filter-option');
				li.addEventListener('click', () => {
					this.addTag(option, category);
					searchInput.value = '';
					this.updateFilterOptions(
						this.filterRecipes(this.searchInput.value),
					);
					const button = container.previousElementSibling;
					this.toggleDropdown({ currentTarget: button });
				});
				customOptionsContainer.appendChild(li);
			}
		}

		container.appendChild(customOptionsContainer);

		searchInput.addEventListener('input', () => {
			const filter = searchInput.value.toLowerCase();
			const optionItems =
				customOptionsContainer.querySelectorAll('li');

			for (let i = 0; i < optionItems.length; i++) {
				const li = optionItems[i];
				if (li.textContent.toLowerCase().includes(filter)) {
					li.style.display = 'block';
				} else {
					li.style.display = 'none';
				}
			}
			clearIcon.style.display =
				searchInput.value.length > 0 ? 'block' : 'none';
		});

		clearIcon.addEventListener('click', () => {
			searchInput.value = '';
			clearIcon.style.display = 'none';

			const optionItems =
				customOptionsContainer.querySelectorAll('li');

			for (let i = 0; i < optionItems.length; i++) {
				const li = optionItems[i];
				li.style.display = 'block';
			}
		});
	}

	// Method to handle opening and closing of filter dropdown menus
	toggleDropdown(event) {
		const button = event.currentTarget;
		const customSelect = button.parentElement;
		const container = button.nextElementSibling;

		if (customSelect.classList.contains('open')) {
			customSelect.classList.remove('open');
			button.classList.remove('open');
			container.style.display = 'none';
		} else {
			customSelect.classList.add('open');
			button.classList.add('open');
			container.style.display = 'block';

			setTimeout(() => {
				const searchInput =
					container.querySelector('.search-input');
				if (searchInput) {
					searchInput.focus();
				}
			}, 100);
		}
	}

	// Method to initialize the application and attach event listeners
	init() {
		this.searchInput.addEventListener('input', () =>
			this.performSearch(),
		);
		this.clearInputButton.addEventListener('click', () =>
			this.clearInput(),
		);
		this.renderRecipes();
		this.renderTags();
		this.toggleClearButton();
		this.updateFilterOptions(this.recipes);
		document
			.querySelector('#ingredients-button')
			.addEventListener('click', (event) =>
				this.toggleDropdown(event),
			);
		document
			.querySelector('#appliances-button')
			.addEventListener('click', (event) =>
				this.toggleDropdown(event),
			);
		document
			.querySelector('#ustensils-button')
			.addEventListener('click', (event) =>
				this.toggleDropdown(event),
			);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new MenuApp();
	app.init();
});
