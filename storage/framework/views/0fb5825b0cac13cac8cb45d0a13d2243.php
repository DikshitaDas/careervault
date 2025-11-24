<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo e(config('app.name')); ?></title>
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.jsx']); ?>
</head>

<body class="antialiased">
    <div id="app"></div>
</body>

</html>
<?php /**PATH C:\xampp\htdocs\careervault\resources\views/app.blade.php ENDPATH**/ ?>