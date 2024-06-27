import { body } from 'express-validator';

const seanceValidationRules = () => {
    const DateSys = new Date(); // Current system date

    return [
        body('DateEvent')
            .isISO8601().withMessage('DateEvent must be a valid ISO 8601 date')
            .custom((value) => {
                const eventDate = new Date(value);
                if (eventDate <= DateSys) {
                    throw new Error('DateEvent must be greater than the current system date');
                }
                return true;
            })
            .toDate(),
        body('Durée')
            .isFloat({ min: 0 }).withMessage('Durée must be a positive number'),
        body('TypeEvent')
            .isLength({ min: 3 }).withMessage('TypeEvent must be at least 3 characters long'),
        body('IdSalleDeSport')
            .isLength({ min: 3 }).withMessage('IdSalleDeSport must be at least 3 characters long'),
        body('NbrParticipant')
            .isNumeric().withMessage('NbrParticipant must be a number'),
        body('Capacity')
            .isNumeric().withMessage('Capacity must be a number')
    ];
};

export { seanceValidationRules };
