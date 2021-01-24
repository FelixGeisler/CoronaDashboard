# https://upload.wikimedia.org/wikipedia/commons/9/95/Karte_der_Kreise_und_Bundesl%C3%A4nder_Deutschlands_2009.svg

def HTMLtoPUG(mystring): 
    mystring = ' '.join(mystring.split())
    mystring = mystring.replace('<path xmlns="http://www.w3.org/2000/svg" ', 'path(')
    mystring = mystring.replace('<polygon xmlns="http://www.w3.org/2000/svg" ', 'polygon(')
    mystring = mystring.replace('/>', ')')
    mystring = mystring.replace('points=" ', 'points="')
    mystring = mystring.replace(' ")', '")')
    mystring = mystring.replace('#E8E8E8', '#022d4d').replace('#545353', '#ffffff')
    return mystring

HTMLtoPUG('<polygon xmlns="http://www.w3.org/2000/svg" fill="#E8E8E8" stroke="#545353" stroke-width="0.2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="3.85" points="    311.875,106.323 313.076,107.043 313.555,107.043 315.475,102.003 315.475,101.283 314.275,101.043 310.916,102.483     309.236,103.923 309.955,106.083   "/>')