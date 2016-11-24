<?php
  $pkg = json_decode(file_get_contents('../package.json'));
?>
<!doctype html>
<html>
<head>
  <title>Hello World.</title>
  <meta charset="utf8" />
  <link href="/styles.css" rel="stylesheet" />
</head>
<body>
  <h1>Hello World.</h1>
  <small><?= phpversion() ?></small>

  <script src="/<?= $pkg->name ?>.js"></script>
</body>
</html>
