UPDATE besi_timekeep_smnl
SET
    total_hours = TRUNCATE(
                        TIME_TO_SEC(TIMEDIFF(logout_time, login_time)) / 3600.0,
                        2 -- Truncate to 2 decimal places (e.g., HH.MM)
                    ),
    ot_hours = TRUNCATE(
                    GREATEST(0, (TIME_TO_SEC(TIMEDIFF(logout_time, login_time)) / 3600.0) - 9),
                    2 -- Truncate to 2 decimal places
               ),
    updated_at = CURRENT_TIMESTAMP -- Update the updated_at timestamp
WHERE
    login_time IS NOT NULL AND logout_time IS NOT NULL and total_hours = 0;
