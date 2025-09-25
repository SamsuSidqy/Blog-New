/*
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/aes.min.js"></script>
*/


export default class EnkripsiAES{

	async decryptData(encryptedDataBase64, key) {
	    // Step 1: Decode the base64 encrypted data
	    const encryptedData = Uint8Array.from(atob(encryptedDataBase64), c => c.charCodeAt(0));
	    
	    /*
	    atob(encryptedDataBase64) digunakan untuk mendekode string Base64 menjadi string biner.

	    Uint8Array.from(..., c => c.charCodeAt(0)) mengubah string biner yang dihasilkan oleh atob menjadi array tipe Uint8Array, yaitu array byte. Ini memastikan bahwa data terenkripsi berada dalam format yang dapat digunakan dalam operasi dekripsi biner.
	    */


	    // Step 2: Extract the IV (first 16 bytes) and the ciphertext
	    const iv = encryptedData.slice(0, 16);  // First 16 bytes is the IV
	    const ciphertext = encryptedData.slice(16);  // Rest is the ciphertext

	    /*
	    IV adalah vektor inisialisasi yang digunakan dalam algoritma AES-CBC untuk memastikan bahwa dekripsi yang sama dengan data yang berbeda menghasilkan hasil yang berbeda. IV diambil dari 16 byte pertama dari data terenkripsi.

	    Ciphertext adalah data terenkripsi itu sendiri, yang dimulai dari byte ke-17 hingga akhir. slice(16) mengembalikan potongan array mulai dari indeks 16 sampai akhir.
	    */



	    // Step 3: Import the key for AES decryption (AES-128)
	    const cryptoKey = await crypto.subtle.importKey(
	        "raw",
	        new TextEncoder().encode(key), // Convert the key string into an ArrayBuffer
	        { name: "AES-CBC" },
	        false,
	        ["decrypt"]
	    );

	    /*
	    crypto.subtle.importKey digunakan untuk mengimpor kunci untuk penggunaan dalam algoritma kriptografi.

	        "raw" menunjukkan bahwa kunci yang diberikan adalah kunci mentah (raw).

	        new TextEncoder().encode(key) mengonversi string key menjadi format ArrayBuffer yang dibutuhkan untuk operasi kriptografi.

	        { name: "AES-CBC" } menunjukkan bahwa kunci ini digunakan untuk algoritma AES dengan mode CBC.

	        false menunjukkan bahwa kunci tidak akan diekspor kembali.

	        ["decrypt"] menunjukkan bahwa kunci ini akan digunakan untuk operasi dekripsi.
	    */

	    // Step 4: Decrypt the ciphertext using AES-CBC mode
	    const decryptedData = await crypto.subtle.decrypt(
	        {
	            name: "AES-CBC",
	            iv: iv
	        },
	        cryptoKey,
	        ciphertext
	    );

	    /*
	    crypto.subtle.decrypt adalah API yang digunakan untuk mendekripsi data.

	    { name: "AES-CBC", iv: iv } adalah objek konfigurasi untuk operasi dekripsi, yang mengindikasikan penggunaan mode AES-CBC dan IV yang telah dipisahkan pada langkah sebelumnya.

	    cryptoKey adalah kunci yang digunakan untuk dekripsi, yang telah diimpor pada langkah sebelumnya.

	    ciphertext adalah data yang terenkripsi yang ingin didekripsi.
	    */

	    // Step 5: Convert the decrypted data back to a string
	    const decryptedText = new TextDecoder().decode(decryptedData);

	    /*
	    new TextDecoder().decode(decryptedData) mengonversi ArrayBuffer hasil dekripsi menjadi string, menggunakan encoding default (UTF-8).

	    decryptedText sekarang berisi teks yang telah didekripsi dalam format string.
	    */

	    // Step 6: Optionally, remove padding (assuming PKCS7 padding)
	    // You can adjust the unpadding logic depending on the padding used during encryption
	    const unpaddedText = decryptedText.replace(/\x00+$/, '');

	    /*
	    Dalam banyak implementasi AES, data yang dienkripsi seringkali dipadding agar panjangnya kelipatan blok (misalnya, 16 byte). AES menggunakan padding seperti PKCS7.

	    decryptedText.replace(/\x00+$/, '') digunakan untuk menghapus padding null (\x00) yang mungkin ada di akhir teks hasil dekripsi. \x00+$ berarti "hapus semua karakter null yang ada di akhir string".
	    */

	    return unpaddedText;
	}

	async EncryptData(plainText, key) {
	    // Step 1: Generate a random IV (16 bytes)
	    const iv = crypto.getRandomValues(new Uint8Array(16)); // 16 bytes IV

	    /*
	    Baris ini menghasilkan Initialization Vector (IV) secara acak. IV ini berfungsi untuk menambah kerandoman pada proses enkripsi, memastikan bahwa dua data yang sama akan menghasilkan ciphertext yang berbeda.

	    crypto.getRandomValues digunakan untuk menghasilkan nilai acak, sementara new Uint8Array(16) memastikan bahwa IV tersebut memiliki panjang 16 byte, yang merupakan panjang yang diperlukan untuk mode enkripsi AES-CBC
	    */

	    // Step 2: Import the key for AES encryption (AES-128)
	    const cryptoKey = await crypto.subtle.importKey(
	        "raw",
	        new TextEncoder().encode(key), // Convert the key string into an ArrayBuffer
	        { name: "AES-CBC" },
	        false,
	        ["encrypt"]
	    );

	    /*
	    Baris ini mengimpor kunci untuk digunakan dalam algoritma enkripsi AES dengan mode CBC (Cipher Block Chaining).

	    crypto.subtle.importKey digunakan untuk mengimpor kunci dari format yang sederhana (raw) ke dalam format yang dapat digunakan oleh API Web Crypto.

	    new TextEncoder().encode(key) mengubah string key menjadi ArrayBuffer, karena importKey membutuhkan kunci dalam bentuk ini.

	    { name: "AES-CBC" } menyatakan bahwa kita menggunakan algoritma AES dengan mode CBC.

	    false menunjukkan bahwa kunci ini tidak akan digunakan untuk dekripsi (hanya untuk enkripsi).

	    ["encrypt"] adalah daftar operasi yang dapat dilakukan dengan kunci ini, dalam hal ini hanya enkripsi yang diizinkan.
	    */

	    // Step 3: Encrypt the plaintext using AES-CBC mode
	    const encryptedData = await crypto.subtle.encrypt(
	        {
	            name: "AES-CBC",
	            iv: iv
	        },
	        cryptoKey,
	        new TextEncoder().encode(plainText) // Convert the plaintext to ArrayBuffer
	    );

	    /*
	    Baris ini melakukan proses enkripsi pada teks yang diberikan (plainText) menggunakan kunci yang telah diimpor (cryptoKey), dengan algoritma AES dalam mode CBC.

	    crypto.subtle.encrypt adalah metode untuk melakukan enkripsi pada data. Parameter pertama adalah konfigurasi enkripsi yang mencakup:

	    name: "AES-CBC" yang menyatakan mode AES-CBC.

	    iv: iv yang menunjukkan IV yang telah dibuat di langkah sebelumnya.

	    new TextEncoder().encode(plainText) mengubah plainText menjadi ArrayBuffer, karena fungsi enkripsi membutuhkan input dalam format ini.
	    */

	    // Step 4: Combine the IV and the ciphertext (IV comes first)
	    const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
	    combinedData.set(iv, 0);
	    combinedData.set(new Uint8Array(encryptedData), iv.length);

	    /*
	    Setelah enkripsi selesai, kita menggabungkan IV yang digunakan dalam enkripsi dengan hasil ciphertext. Menggabungkan keduanya penting karena penerima harus mengetahui IV untuk mendekripsi data dengan benar.

	    new Uint8Array(iv.length + encryptedData.byteLength) membuat array baru yang memiliki panjang gabungan antara panjang IV dan panjang ciphertext.

	    combinedData.set(iv, 0) menyalin IV ke posisi awal array yang baru.

	    combinedData.set(new Uint8Array(encryptedData), iv.leng
	    */

	    // Step 5: Convert the combined encrypted data to Base64
	    const base64EncryptedData = btoa(String.fromCharCode(...combinedData));
	    
	    /*
	    Di sini, data yang digabungkan (IV + ciphertext) diubah menjadi format Base64 agar lebih mudah untuk disimpan atau dikirim melalui media yang hanya mendukung teks (seperti email atau HTTP).

	    String.fromCharCode(...combinedData) mengubah setiap byte dari combinedData menjadi karakter yang sesuai.
	    */
	    return base64EncryptedData;
	}
}