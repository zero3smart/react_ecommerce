
per_prd_prop_max_vals = {
            'coretype' : 3,
            'waist':6, 'sleeve_tightness':4, 'sleeve_length':7, 'neckline':5, 'belly':6,
            'collar':5, 'shoulder':4, 'chest':5, 'top_length':4}
per_prd_col_prop_max_vals = {'solid':1, 'checker':1, 'stripe':1, 'pattern':1, 'details':1}

base_body_props = ['waist', 'sleeve_tightness', 'sleeve_length', 'neckline', 'belly', 'collar', 'shoulder', 'chest', 'top_length']
per_prd_props = list(per_prd_prop_max_vals.keys())
per_prd_col_props = list(per_prd_col_prop_max_vals.keys())

maternity_brands = ['Ingrid & Isabel', 'LOYAL HANA', 'NOPPIES', 'NURTURE-ELLE', 'Everly Grey', 'Isabella Oliver',
        'LAB40', 'NOM', 'ROSIE POPE', 'Tart Maternity', 'Olian', 'PIETRO BRUNELLI', 'Kimi and Kai', 'Momzelle', 'BELLA MATERNA', 
        'Maternal America', 'LILAC CLOTHING', 'AMARI', 'BLANQI', 'Savi Mom', 'The Urban Ma', 'Bun Maternity', 'BRAVADO DESIGNS',
        'BELLY BANDIT', 'KINWOLFE', 'Modern Eternity', 'ANGEL MATERNITY']

black_listed_pids = ['4881986', '4835056', '4886971']

ns_server_url = 'https://shop.nordstrom.com'

