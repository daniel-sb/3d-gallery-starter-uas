export const paintingData = [
  // Front Wall — tiap lukisan diisi manual (edit info di sini)
  {
    imgSrc: `artworks/1.jpg`,
    width: 5,
    height: 3,
    position: { x: -15, y: 2, z: -19.5 },
    rotationY: 0,
    info: {
      title: 'Karya 1',
      artist: 'Nama Kamu',
      description: 'Deskripsi karya 1. Ganti gambar di public/artworks/1.jpg dan isi info ini.',
      year: '2026',
      link: '#',
    },
  },
  {
    imgSrc: `artworks/2.jpg`,
    width: 5,
    height: 3,
    position: { x: -5, y: 2, z: -19.5 },
    rotationY: 0,
    info: {
      title: 'Karya 2',
      artist: 'Nama Kamu',
      description: 'Deskripsi karya 2.',
      year: '2026',
      link: '#',
    },
  },
  {
    imgSrc: `artworks/3.jpg`,
    width: 5,
    height: 3,
    position: { x: 5, y: 2, z: -19.5 },
    rotationY: 0,
    info: {
      title: 'Karya 3',
      artist: 'Nama Kamu',
      description: 'Deskripsi karya 3.',
      year: '2026',
      link: '#',
    },
  },
  {
    imgSrc: `artworks/4.jpg`,
    width: 5,
    height: 3,
    position: { x: 15, y: 2, z: -19.5 },
    rotationY: 0,
    info: {
      title: 'Karya 4',
      artist: 'Nama Kamu',
      description: 'Deskripsi karya 4.',
      year: '2026',
      link: '#',
    },
  },
  // Back Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `artworks/${i + 5}.jpg`,
    width: 5,
    height: 3,
    position: { x: -15 + 10 * i, y: 2, z: 19.5 },
    rotationY: Math.PI,
    info: {
      title: `Van Gogh ${i + 5}`,
      artist: 'Vincent van Gogh',
      description: `Artwork ${
        i + 5
      } by Vincent van Gogh is an exceptional piece showcasing his remarkable ability to capture emotion and atmosphere.`,
      year: `Year ${i + 5}`,
      link: 'https://github.com/theringsofsaturn',
    },
  })),
  // Left Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `artworks/${i + 9}.jpg`,
    width: 5,
    height: 3,
    position: { x: -19.5, y: 2, z: -15 + 10 * i },
    rotationY: Math.PI / 2,
    info: {
      title: `Van Gogh ${i + 9}`,
      artist: 'Vincent van Gogh',
      description: `With its striking use of color and brushwork, Artwork ${
        i + 9
      } is a testament to Van Gogh's artistic genius.`,
      year: `Year ${i + 9}`,
      link: 'https://github.com/theringsofsaturn',
    },
  })),
  // Right Wall
  ...Array.from({ length: 4 }, (_, i) => ({
    imgSrc: `artworks/${i + 13}.jpg`,
    width: 5,
    height: 3,
    position: { x: 19.5, y: 2, z: -15 + 10 * i },
    rotationY: -Math.PI / 2,
    info: {
      title: `Van Gogh ${i + 13}`,
      artist: 'Vincent van Gogh',
      description: `Artwork ${
        i + 13
      } is a captivating piece by Vincent van Gogh, reflecting his distinctive style and deep passion for art.`,
      year: `Year ${i + 13}`,
      link: 'https://github.com/theringsofsaturn',
    },
  })),
];
