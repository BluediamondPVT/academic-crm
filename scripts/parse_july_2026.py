import openpyxl
import json
import re
from datetime import datetime

wb = openpyxl.load_workbook('Academic CRM.xlsx', data_only=True)
sheet = wb['JULY 2026 ']
rows = [r for r in sheet.iter_rows(values_only=True) if any(c is not None for c in r)]
header = [str(c).strip() if c is not None else '' for c in rows[0]]

UNIS = {
    'DY Patil': {'id': '6a50cc1ebc5a5db723e4a709', 'name': 'dy patil university '},
    'Amity': {'id': '6a509e011108eced862905a7', 'name': 'amity university'},
    'Manglytan': {'id': '6a50c7221108eced86290647', 'name': 'mangalayatan university'},
    'GLA': {'id': '6a54823d0d07eda1225e4035', 'name': 'GLA University'}
}

FARDEEN_ID = '6ab9fa80a078ecea852dc52f'
FARDEEN_NAME = 'Fardeen'
FARDEEN_ROLE = 'ACADEMIC'

students = []

def parse_float(val, default=0.0):
    if val is None:
        return default
    if isinstance(val, (int, float)):
        return float(val)
    val_str = str(val).replace(',', '').strip()
    match = re.search(r'[-+]?\d*\.?\d+', val_str)
    if match:
        try:
            return float(match.group(0))
        except ValueError:
            return default
    return default

for idx, r in enumerate(rows[1:]):
    d = {header[i]: r[i] for i in range(min(len(header), len(r))) if header[i] and r[i] is not None}
    name = str(d.get('Student Name', '')).strip()
    if not name:
        continue
    
    # Phone clean
    raw_phone = str(d.get('CONTACT NO', '')).replace('.0', '').replace(' ', '').replace('\n', '').strip()
    phone_match = re.search(r'\d{10}', raw_phone)
    phone = phone_match.group(0) if phone_match else raw_phone[:10]
    
    # Course
    course = str(d.get('Course', '')).strip()
    
    # University
    raw_uni = str(d.get('University', '')).strip()
    uni_info = UNIS.get(raw_uni, UNIS['Manglytan'])
    
    # Fees
    paid_fee = parse_float(d.get('Paid Fees'))
    fee_1 = parse_float(d.get('One Year Fees'))
    fee_2 = parse_float(d.get('2nd year Fees'))
    fee_3 = parse_float(d.get('3rd year Fees'))
    
    # Total course fee calculation
    total_fee = fee_1 + fee_2 + fee_3 if (fee_2 or fee_3) else fee_1
    if total_fee == 0:
        total_fee = paid_fee
    
    rem_fee = max(0.0, total_fee - paid_fee)
    
    # Univ Amt
    raw_univ = d.get('Pending to pay to University') or d.get('Paid to University')
    univ_amt = 0.0
    if isinstance(raw_univ, (int, float)):
        univ_amt = float(raw_univ)
    elif isinstance(raw_univ, str) and re.search(r'\d+', raw_univ):
        univ_amt = float(re.search(r'\d+', raw_univ).group(0))
    
    profit = max(0.0, paid_fee - univ_amt)
    
    # Date
    raw_date = d.get('Date OF Lead Punch') or d.get('Pay to University \nDate')
    if isinstance(raw_date, datetime):
        punch_date = raw_date.strftime('%Y-%m-%dT00:00:00.000Z')
    else:
        punch_date = f'2026-07-{(idx % 20) + 1:02d}T00:00:00.000Z'
    
    # Counselor & Source info
    counselor_in_sheet = str(d.get('Counsellor') or d.get(' Counsellor', '')).strip()
    source_in_sheet = str(d.get('SOURCE', '')).strip()
    lms_id = str(d.get('LMS ID', '')).replace('.0', '').strip()
    unique_id = str(d.get('Unique ID', '')).replace('.0', '').strip()
    
    note_parts = []
    if unique_id:
        note_parts.append(f'UID: {unique_id}')
    if lms_id:
        note_parts.append(f'LMS ID: {lms_id}')
    if source_in_sheet:
        note_parts.append(f'Source: {source_in_sheet}')
    if counselor_in_sheet:
        note_parts.append(f'Counselor: {counselor_in_sheet}')
    remark_str = '. '.join(note_parts)
    
    clean_email_name = re.sub(r'[^a-zA-Z0-9]', '.', name.lower().strip())
    email = f'{clean_email_name}@student.com'
    
    student_obj = {
        'name': name,
        'phoneNumber': phone,
        'email': email,
        'city': 'Mumbai',
        'universityId': uni_info['id'],
        'universityName': uni_info['name'],
        'courseName': course,
        'totalFee': total_fee,
        'yearFee': fee_1,
        'totalPaid': paid_fee,
        'remainingFee': rem_fee,
        'paidToUniversity': univ_amt,
        'profit': profit,
        'payoutPercentage': 50 if 'Manglytan' in raw_uni else 20,
        'status': 'Admission',
        'session': 'July 2026',
        'counselorId': FARDEEN_ID,
        'counselorName': FARDEEN_NAME,
        'counselorRole': FARDEEN_ROLE,
        'createdAt': punch_date,
        'updatedAt': punch_date,
        'admissionRemark': remark_str,
        'admissionRemarkUpdatedAt': punch_date,
        'payments': [
            {
                'paymentType': 'Yearly',
                'amount': paid_fee,
                'paidToUniversity': univ_amt,
                'profit': profit,
                'paymentMode': 'UPI / Bank',
                'date': punch_date,
                'remark': f'Admission Payment - {remark_str}'
            }
        ]
    }
    students.append(student_obj)

print('Generated students count:', len(students))
with open('scripts/july_2026_data.json', 'w') as f:
    json.dump(students, f, indent=2)
print('Saved to scripts/july_2026_data.json successfully!')
