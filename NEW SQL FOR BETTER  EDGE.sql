CREATE TABLE besi_smnl_series (
  id INT PRIMARY KEY AUTO_INCREMENT,
  series_data JSON NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- u899193124_asianowjt.besi_users_smnl definition
DROP TABLE besi_users_smnl
CREATE TABLE `besi_users_smnl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `region` varchar(10) DEFAULT NULL,
  `besi_id` varchar(50) DEFAULT NULL,
  `ocw_id` varchar(50) DEFAULT NULL,
  `jms_id` varchar(50) DEFAULT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `middle_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `full_name` varchar(150) DEFAULT NULL,
  `date_hired` date DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `hub` varchar(50) DEFAULT NULL,
  `position_code` varchar(5) DEFAULT NULL,
  `date_added` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_besi_id` (`besi_id`),
  KEY `idx_ocw_id` (`ocw_id`),
  KEY `idx_jms_id` (`jms_id`),
  KEY `idx_full_name` (`full_name`),
  KEY `idx_email` (`email`),
  KEY `idx_hub` (`hub`)
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

//=======FOR CREATING NEW TRANSACTION TABLES========
CREATE TABLE besi_transaction (
    id int(11) NOT NULL AUTO_INCREMENT,
    emp_id int(11) DEFAULT NULL,
    transaction_number varchar(30) DEFAULT NULL,
    parcel int(6) DEFAULT 0,
    actual_parcel int(6) DEFAULT 0,
    amount double DEFAULT 0,
    actual_amount double DEFAULT 0,
    remarks text DEFAULT NULL,
    created_at date DEFAULT (CURRENT_DATE),
    login_time timestamp NULL DEFAULT NULL,
    logout_time timestamp NULL DEFAULT NULL,
    date_only date GENERATED ALWAYS AS (cast(`created_at` as date)) STORED,
    
    -- 1. We add the region column right here for partitioning
    region varchar(50) NOT NULL, 
    
    -- 2. CRITICAL: Both 'id' and 'region' must be combined into the Primary Key
    PRIMARY KEY (id, region),
    
    -- 3. We keep your original index for the employee ID
    KEY idx_emp_id (emp_id)
)
-- 4. Set up the automatic regional filing cabinet drawers
PARTITION BY LIST COLUMNS(region) (
    PARTITION p_bacolod VALUES IN ('bacolod'),
    PARTITION p_bicol VALUES IN ('bicol'),
    PARTITION p_central VALUES IN ('central'),
    PARTITION p_cmnl VALUES IN ('cmnl'),
    PARTITION p_cmnva VALUES IN ('cmnva'),
    PARTITION p_hpro VALUES IN ('hpro'),
    PARTITION p_min VALUES IN ('min'),
    PARTITION p_nelu VALUES IN ('nelu'),
    PARTITION p_nwlu VALUES IN ('nwlu'),
    PARTITION p_panay VALUES IN ('panay'),
    PARTITION p_slu VALUES IN ('slu'),
    PARTITION p_smarlyete VALUES IN ('smarlyete'),
    PARTITION p_smnl VALUES IN ('smnl'),
    PARTITION p_yncr VALUES IN ('yncr'),
    PARTITION p_ynelu VALUES IN ('ynelu'),
    PARTITION p_yslu VALUES IN ('yslu')
);

///=====================COPY ASN_TRANSACTION TO NEW BESI_TRANSACTION========================
INSERT INTO besi_transaction (
    id, 
    emp_id, 
    transaction_number, 
    parcel, 
    actual_parcel, 
    amount, 
    actual_amount, 
    remarks, 
    created_at, 
    login_time, 
    logout_time, 
    region
)
SELECT 
    x.id,
    x.emp_id,
    x.transaction_number,
    x.parcel,
    x.actual_parcel,
    x.amount,
    x.actual_amount,
    x.remarks,
    x.created_at,
    x.login_time,
    x.logout_time,
    z.region 
FROM 
    asn_transaction x
INNER JOIN 
    asn_users y ON y.id = x.emp_id
INNER JOIN 
    asn_hub z ON z.hub = y.hub
WHERE 
    x.created_at >= '2026-06-01' AND x.created_at < '2026-07-01';



///==================CREATE UNIVERSAL USER TABLE========================
CREATE TABLE besi_employees (
    id int(10) unsigned NOT NULL AUTO_INCREMENT,
    emp_id varchar(50) NOT NULL,
    jms_id varchar(50) DEFAULT NULL,
    first_name varchar(150) DEFAULT NULL,
    middle_name varchar(150) DEFAULT NULL,
    last_name varchar(150) DEFAULT NULL,
    suffix varchar(150) DEFAULT NULL,
    full_name varchar(150) DEFAULT NULL,
    email varchar(100) NOT NULL,
    phone varchar(20) DEFAULT NULL,
    birth_date date DEFAULT NULL,
    hire_date date DEFAULT NULL,
    position varchar(100) DEFAULT NULL,
    daily_rate decimal(10,2) DEFAULT NULL,
    education_level varchar(150) DEFAULT NULL,
    department varchar(100) DEFAULT NULL,
    employment_status varchar(50) DEFAULT NULL,
    street_1 varchar(150) DEFAULT NULL,
    street_2 varchar(150) DEFAULT NULL,
    city varchar(150) DEFAULT NULL,
    bgy varchar(150) DEFAULT NULL,
    full_address text DEFAULT NULL,
    created_at date DEFAULT (curdate()),
    updated_at date DEFAULT (curdate()),
    active tinyint(4) DEFAULT 1,
    
    -- 1. Added the hub column at the end
    hub varchar(50) DEFAULT NULL,
    
    -- 2. Added the region column for partitioning
    region varchar(50) NOT NULL,
    
    -- 3. Composite Primary Key and Unique Keys required for partitioning
    PRIMARY KEY (id, region),
    UNIQUE KEY uni_emp_id_region (emp_id, region),
    UNIQUE KEY uni_email_region (email, region),
    
    -- 4. This creates the MUL key (standard index) on the hub column
    KEY idx_hub (hub)
)
-- 5. Set up the automatic regional partitions
PARTITION BY LIST COLUMNS(region) (
    PARTITION p_bacolod VALUES IN ('bacolod'),
    PARTITION p_bicol VALUES IN ('bicol'),
    PARTITION p_central VALUES IN ('central'),
    PARTITION p_cmnl VALUES IN ('cmnl'),
    PARTITION p_cmnva VALUES IN ('cmnva'),
    PARTITION p_hpro VALUES IN ('hpro'),
    PARTITION p_min VALUES IN ('min'),
    PARTITION p_nelu VALUES IN ('nelu'),
    PARTITION p_nwlu VALUES IN ('nwlu'),
    PARTITION p_panay VALUES IN ('panay'),
    PARTITION p_slu VALUES IN ('slu'),
    PARTITION p_smarlyete VALUES IN ('smarlyete'),
    PARTITION p_smnl VALUES IN ('smnl'),
    PARTITION p_yncr VALUES IN ('yncr'),
    PARTITION p_ynelu VALUES IN ('ynelu'),
    PARTITION p_yslu VALUES IN ('yslu')
);

/* this is also if there is additional region and add a new partition for it, you can do it like this:
ALTER TABLE besi_employees 
ADD PARTITION (
    PARTITION p_newregion VALUES IN ('newregion')
);
*/

///==================CREATE TRIGGER AFTER TABLE CREATION========================
DELIMITER $$

CREATE TRIGGER global_employee_insert
AFTER INSERT ON besi_employees
FOR EACH ROW
BEGIN
    INSERT IGNORE INTO besi_users (
        besi_id, 
        email, 
        full_name, 
        hub, 
        location, 
        position_code,
        region -- 1. We pass the region to the unified users table
    )
    VALUES (
        NEW.emp_id, 
        NEW.email, 
        NEW.full_name, 
        NEW.hub, 
        NEW.location, 
        NEW.position,
        NEW.region -- 2. Dynamically copies 'nelu', 'bacolod', etc.
    );
END$$

DELIMITER ;

//=================== trigger for besi_transaction turn it up if needed =========================
DELIMITER //

CREATE TRIGGER after_besi_transaction_insert
AFTER INSERT ON besi_transaction
FOR EACH ROW
BEGIN
    UPDATE LOGIN_AUDIT
    SET total_count = 0
    WHERE id = 1;  
END //

DELIMITER ;
