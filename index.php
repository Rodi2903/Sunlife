<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $client_name = htmlspecialchars($_POST['client_name']);
    $plan = htmlspecialchars($_POST['plan']);
    $policy_no = htmlspecialchars($_POST['policy_no']);
    $policy_anniversary = htmlspecialchars($_POST['policy_anniversary']);
    $total_paid = floatval($_POST['total_paid']);
    $balance = floatval($_POST['balance']);
    $premium_amount = floatval($_POST['premium_amount']);
    $mode_of_payment = htmlspecialchars($_POST['mode_of_payment']);

    $payments = [];
    for ($i = 0; $i < count($_POST['coverage_date']); $i++) {
        $payments[] = [
            htmlspecialchars($_POST['coverage_date'][$i]),
            floatval($_POST['payment_amount'][$i]),
            htmlspecialchars($_POST['status'][$i])
        ];
    }
} else {
    $client_name = "Emmanuel Bugarin Casem";
    $plan = "Sun Maxilink Prime";
    $policy_no = "832309990";
    $policy_anniversary = "Sep 15, 2021";
    $total_paid = 43303.00;
    $balance = 36575.75;
    $premium_amount = 5325.25;
    $mode_of_payment = "Quarterly";

    $payments = [
        ["15-Sep-2021 to 15-Sep-2022", 21301.00, "PAID"],
        ["15-Sep-2022 to 15-Sep-2023", 21301.00, "PAID"],
        ["15-Sep-2023 to 15-Sep-2024", 21301.00, "PAID 701.00 with balance 20,600.00"],
        ["15-Sep-2024 to 15-Dec-2024", 5325.25, "NOT PAID"],
        ["15-Dec-2024 to 15-Mar-2025", 5325.26, "NOT PAID"],
        ["15-Mar-2025 to 15-Jun-2025", 5325.27, "NOT PAID, FUTURE DUE"],
        ["15-Jun-2025 to 15-Sep-2025", 5325.28, "NOT PAID"]
    ];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Statement of Account</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; }
        .container { width: 80%; margin: auto; background: #0b3d6b; color: white; padding: 20px; border-radius: 10px; }
        .header { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid white; }
        th { background: #0d4b87; }
        .form-container { margin-bottom: 40px; }
        label { display: block; margin-top: 10px; }
        input, button { padding: 8px; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="form-container">
        <form method="POST" action="">
            <label>Client's Name: <input type="text" name="client_name" value="<?= $client_name; ?>" required></label>
            <label>Plan: <input type="text" name="plan" value="<?= $plan; ?>" required></label>
            <label>Policy No: <input type="text" name="policy_no" value="<?= $policy_no; ?>" required></label>
            <label>Policy Anniversary: <input type="text" name="policy_anniversary" value="<?= $policy_anniversary; ?>" required></label>
            <label>Mode of Payment: <input type="text" name="mode_of_payment" value="<?= $mode_of_payment; ?>" required></label>
            <label>Total Paid: <input type="number" step="0.01" name="total_paid" value="<?= $total_paid; ?>" required></label>
            <label>Balance: <input type="number" step="0.01" name="balance" value="<?= $balance; ?>" required></label>

            <h3>Payment Details:</h3>
            <?php foreach ($payments as $index => $payment): ?>
                <div>
                    <label>Coverage Date: <input type="text" name="coverage_date[]" value="<?= $payment[0]; ?>" required></label>
                    <label>Payment Amount: <input type="number" step="0.01" name="payment_amount[]" value="<?= $payment[1]; ?>" required></label>
                    <label>Status: <input type="text" name="status[]" value="<?= $payment[2]; ?>" required></label>
                </div>
            <?php endforeach; ?>
            <button type="submit">Generate Statement</button>
        </form>
    </div>

    <div class="container">
        <h2>ACCOUNT SUMMARY</h2>
        <p><span class="header">CLIENT'S NAME:</span> <?= $client_name; ?></p>
        <p><span class="header">Plan:</span> <?= $plan; ?></p>
        <p><span class="header">Policy No:</span> <?= $policy_no; ?></p>
        <p><span class="header">Policy Anniversary:</span> <?= $policy_anniversary; ?></p>
        <p><span class="header">Mode of Payment:</span> <?= $mode_of_payment; ?></p>

        <h3>Total paid for whole duration: PHP <?= number_format($total_paid, 2); ?></h3>
        <h3>Balance: PHP <?= number_format($balance, 2); ?></h3>

        <table>
            <thead>
                <tr>
                    <th>Coverage Date</th>
                    <th>Premium Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($payments as $payment): ?>
                    <tr>
                        <td><?= $payment[0]; ?></td>
                        <td>PHP <?= number_format($payment[1], 2); ?></td>
                        <td><?= $payment[2]; ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
