import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask import Flask, request, jsonify

# Ma'lumotlarni yuklash
data = pd.read_csv("books.csv")

# Ma'lumotlarni tayyorlash
le_genre = LabelEncoder()
data['genre_encoded'] = le_genre.fit_transform(data['genre'])

tokenizer = Tokenizer()
tokenizer.fit_on_texts(data['title'])
sequences = tokenizer.texts_to_sequences(data['title'])
padded_sequences = pad_sequences(sequences, maxlen=10)

# Modelni yaratish
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=len(tokenizer.word_index) + 1, output_dim=64, input_length=10),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(len(le_genre.classes_), activation='softmax')
])

# Modelni o'qitish
model.compile(optimizer='adam', loss=tf.compat.v1.losses.sparse_softmax_cross_entropy, metrics=['accuracy'])
# Agar yuqoridagi ogohlantirish chiqsa, loss funksiyasini quyidagicha o'zgartiring:
# model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

model.fit(padded_sequences, data['genre_encoded'], epochs=10, batch_size=32)

# Flask API
app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend():
    req_data = request.get_json()
    book_id = req_data['book_id']
    top_n = req_data.get('top_n', 5)

    book_idx = data[data['id'] == book_id].index[0]
    book_genre = data.iloc[book_idx]['genre_encoded']
    book_sequence = padded_sequences[book_idx].reshape(1, -1)

    predictions = model.predict(book_sequence)
    similar_books = data.iloc[np.argsort(-predictions[0])[:top_n + 1]]
    similar_books = similar_books[similar_books.index != book_idx]

    recommendations = similar_books[['id', 'title', 'genre', 'price', 'rating']].to_dict('records')
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True, port=5000)