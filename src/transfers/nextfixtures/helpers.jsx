import React from 'react';
import * as collegeIcons from './collegeicons/icons';

// eslint-disable-next-line import/prefer-default-export
export const renderCollegeIcon = (collegeName, styles) => {
    if (collegeName.includes('Collingwood')) {
        return <img src={collegeIcons.collingwood} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('Josephine Butler')) {
        return <img src={collegeIcons.butler} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('St. Mary\'s')) {
        return <img src={collegeIcons.marys} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('University')) {
        return <img src={collegeIcons.university} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('St. Cuthbert\'s')) {
        return <img src={collegeIcons.cuths} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('Hatfield')) {
        return <img src={collegeIcons.hatfield} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('Grey')) {
        return <img src={collegeIcons.grey} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('St. Hild & St. Bede')) {
        return <img src={collegeIcons.hildbede} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('Trevelyan')) {
        return <img src={collegeIcons.trevs} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('John Snow')) {
        return <img src={collegeIcons.johnsnow} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('St. John\'s')) {
        return <img src={collegeIcons.johns} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('St. Chad\'s')) {
        return <img src={collegeIcons.chads} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('St. Aidan\'s')) {
        return <img src={collegeIcons.aidans} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('Ustinov')) {
        return <img src={collegeIcons.ustinov} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('Van Mildert')) {
        return <img src={collegeIcons.mildert} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    if (collegeName.includes('Stephenson')) {
        return <img src={collegeIcons.stephenson} className={styles.collegeIcon} alt="collegeCrest" />;
    }
    return <img src={collegeIcons.collingwood} className={styles.collegeIcon} alt="collegeCrest" />;
};
