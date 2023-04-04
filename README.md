## Installation

```
npm install -g to-tailwind
```

## Usage

```html
<!-- ./test/test.html -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <!-- reset default style -->
  <link rel="stylesheet" href="./base.css">
  <link rel="stylesheet" href="./test.css">
</head>
<body>
  <figure>
    <img 
      src="https://www.tailwindcss.cn/_next/static/media/sarah-dayan.a8ff3f1095a58085a82e3bb6aab12eb2.jpg" 
      alt="figure-image"
    >
    <div>
      <blockquote>
        <p>
          “Tailwind CSS is the only framework that I've seen scale
          on large teams. It’s easy to customize, adapts to any design,
          and the build size is tiny.”
        </p>
      </blockquote>
      <figcaption>
        <div>
          Sarah Dayan
        </div>
        <div>
          Staff Engineer, Algolia
        </div>
      </figcaption>
    </div>
  </figure>
  </body>

</html>
```

```css
/* ./test/test.css */
body {
  width: 100vw;
  height: 100vh;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

figure {
  width: 576px;
  height: 240px;
  display: flex;
}

figure > img {
  width: 192px;
  height: 240px;
}

figure > div {
  padding: 32px;
  background-color: white;
}

figure > div > blockquote {
  margin-bottom: 16px;
}

figure > div > blockquote > p {
  font-weight: 600;
  font-size: 18px;
}

figure > div > figcaption > div:first-of-type {
  color: #0891b2;
}

figure > div > figcaption > div:last-of-type {
  color: #71717A;
}
```

run

```
to-tailwind --html ./your-directory/test/index.html --css ./your-directory/test/index.css --output ./your-directory/target/output.html 
```

```html
<!-- ./target/output.html(formatted) -->
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <!-- 
    <link rel="stylesheet" href="./base.css">
    <link rel="stylesheet" href="./test.css"> 
  -->

  <!-- Import tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="w-[100vw] h-[100vh] bg-[#eee] flex justify-center items-center">
  <figure class="w-[576px] h-[240px] flex">
    <img
      src="https://www.tailwindcss.cn/_next/static/media/sarah-dayan.a8ff3f1095a58085a82e3bb6aab12eb2.jpg"
      alt="figure-image" 
      class="w-[192px] h-[240px]"
    >
    <div class="p-[32px] bg-[white]">
      <blockquote class="mb-[16px]">
        <p class="font-semibold text-[18px]">“Tailwind CSS is the only framework that I've seen scale
          on large teams. It’s easy to customize, adapts to any design,
          and the build size is tiny.”</p>
      </blockquote>
      <figcaption>
        <div class="text-[#0891b2]">Sarah Dayan</div>
        <div class="text-[#71717A]">Staff Engineer, Algolia</div>
      </figcaption>
    </div>
  </figure>
</body>

</html>
```
