import express from 'express';
import protect from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// CREATE
router.post('/', protect, async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json(task);
});

// READ all
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

// UPDATE
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Task not found' });
  }
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Task not found' });
  }
  await task.deleteOne();
  res.json({ message: 'Task removed' });
});

export default router;