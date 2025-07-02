const Food = require('../models/Food');

exports.list = async (req, res) => {
    res.json(await Food.find());
};

exports.create = async (req, res) => {
    const item = new Food(req.body);
    await item.save();
    res.json(item);
};

exports.update = async (req, res) => {
    const item = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
};

exports.remove = async (req, res) => {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Устгагдсан' });
};

exports.addIngredient = async (req, res) => {
    try {
        const { ingredient } = req.body;

        if (!ingredient || typeof ingredient !== 'string') {
            return res.status(400).json({ message: 'Ingredient must be a non-empty string.' });
        }

        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food item not found.' });


        if (!food.ingredients.includes(ingredient)) {
            food.ingredients.push(ingredient);
            await food.save();
        }

        res.json({ message: 'Ingredient added', ingredients: food.ingredients });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};

