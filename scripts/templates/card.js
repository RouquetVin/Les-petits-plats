// Creation of the CardTemplate class
export class CardTemplate {
	// Method to create and return an element with a class and text content
	createElement(tag, className, textContent) {
		const element = document.createElement(tag);
		if (className) element.classList.add(className);
		if (textContent) element.textContent = textContent;
		return element;
	}

	getMenuCardDom(menu) {
		// Destructure the menu object
		const { image, name, ingredients, description, time } = menu;

		// Create the main article element for the card
		const article = this.createElement('article', 'card');

		// Create and set up the image element
		const img = this.createElement('img');
		img.src = `./images/${image}`;
		img.alt = name;

		// Create and set up the time label element
		const timeLabel = this.createElement(
			'div',
			'time_label',
			`${time}min`,
		);

		// Create the content container for the card
		const cardContent = this.createElement('div', 'card_content');

		// Create and set up the title element
		const title = this.createElement('h2', null, name);

		// Create and set up the "RECETTE" heading
		const recipe = this.createElement('h3', null, 'RECETTE');

		// Create and set up the recipe description element
		const description_recipe = this.createElement(
			'p',
			'description_recipe',
			description,
		);

		// Create and set up the "INGRÉDIENTS" heading
		const ingrts = this.createElement('h3', null, 'INGRÉDIENTS');

		// Create the container for the ingredients
		const ingredients_description = this.createElement(
			'div',
			'ingredients',
		);

		// Loop through each ingredient and create its elements
		ingredients.forEach((ingredient) => {
			// Create the container for a single ingredient
			const ingredient_element = this.createElement(
				'div',
				'ingredient',
			);

			// Create and set up the ingredient name element
			const title_ingredients = this.createElement(
				'p',
				'ingredient_name',
				ingredient.ingredient,
			);

			// Determine the quantity text
			const quantityText =
				ingredient.quantity !== undefined
					? ingredient.quantity +
					  (ingredient.unit ? ` ${ingredient.unit}` : '')
					: '-';

			// Create and set up the ingredient quantity element
			const quant = this.createElement(
				'p',
				'ingredient_quantity',
				quantityText,
			);

			// Append the name and quantity elements to the ingredient container
			ingredient_element.appendChild(title_ingredients);
			ingredient_element.appendChild(quant);

			// Append the ingredient container to the ingredients description container
			ingredients_description.appendChild(ingredient_element);
		});

		// Append all content elements to the card content container
		cardContent.appendChild(title);
		cardContent.appendChild(recipe);
		cardContent.appendChild(description_recipe);
		cardContent.appendChild(ingrts);
		cardContent.appendChild(ingredients_description);

		// Append the image, time label, and content container to the main article element
		article.appendChild(img);
		article.appendChild(timeLabel);
		article.appendChild(cardContent);

		// Return the complete article element representing the menu card
		return article;
	}
}
