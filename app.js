const express = require('express');
const db = require('./db');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/buku', (req, res) => {
    const query = 'SELECT * FROM buku';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.get('/buku/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM buku WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Buku tidak ditemukan' });
        res.json(result[0]);
    });
});

app.post('/buku', (req, res) => {
    const { judul, penulis, tahun } = req.body;

    if (!judul || !penulis || !tahun) {
        return res.status(400).json({ message: 'Judul, Penulis, dan Tahun harus diisi!' });
    }

    const query = 'INSERT INTO buku (judul, penulis, tahun) VALUES (?, ?, ?)';
    db.query(query, [judul, penulis, tahun], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            message: 'Buku berhasil ditambahkan',
            id: result.insertId,
            data: { judul, penulis, tahun }
        });
    });
});

app.put('/buku/:id', (req, res) => {
    const id = req.params.id;
    const { judul, penulis, tahun } = req.body;

    if (!judul || !penulis || !tahun) {
        return res.status(400).json({ message: 'Data tidak boleh kosong untuk update!' });
    }

    const query = 'UPDATE buku SET judul = ?, penulis = ?, tahun = ? WHERE id = ?';
    
    db.query(query, [judul, penulis, tahun, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Buku tidak ditemukan' });
        
        res.json({ message: `Buku dengan ID ${id} berhasil diperbarui` });
    });
});

app.delete('/buku/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM buku WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Buku tidak ditemukan' });
        
        res.json({ message: `Buku dengan ID ${id} berhasil dihapus` });
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
