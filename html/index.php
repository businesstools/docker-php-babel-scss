<?php
  $pkg = json_decode(file_get_contents('../package.json'));
  $uri = trim($_SERVER['REQUEST_URI'], '/');

  if ($uri != '') http_response_code(404);

?><!doctype html>
<html>
<head>
  <title>Hello World.</title>
  <meta charset="utf-8" />
  <?php if (getenv('NODE_ENV') !== 'development'): ?>
  <link href="/min/<?= $pkg->name ?>.css" rel="stylesheet" />
  <?php endif ?>
</head>
<body>
  <h1>Hello World.</h1>
  <small><?= phpversion() ?></small>

  <script src="/min/<?= $pkg->name ?>.js"></script>
</body>
</html>
