from Crypto.Util.number import *


flag1 = b"***********"
flag2 = b"***********"
flag3 = b"*************"
flag4 = b"**************"
flag = flag1 + flag2 + flag3 + flag4

# 以下是第一段flag
p = getPrime(1024)
q = getPrime(1024)
print(p)
print(q)
n = p * q
print(f"n = {n}")
# n = 13302964813216810941959666853255210222342583731188082654677741702223980173634749035809268518166097414434192674822811161141232218989083448209641034748898355565960444187407647440933753873730008876632728962548755659432142376338455108281224538491079440785562167134963433706421826981438843271822167502821919515149444873613819013331369065110101337902941674825712675331337192584554239676773259170817522171700027400374630546727379609299264299681651475097765699741114447792901436790229998294306916894452371375071533631328031610536615598947958107097016439368371325981828840867911530866451562126546387416586140060791073626618171
e = 8545970560619293415863869061629533131353052726527575105498824066096173134202176407771698168891393791901508803718121936403456285176580496345915728675609872087314945931309067503425183949923543095686689494879877359916226960617400586139116144067054907570518268413146641607525379529898998165978606786256497
m = bytes_to_long(flag1)
d = inverse(e, (p-1) * (q-1))
c = pow(m, e, n)
print(f"d = {d}")
print(f"c = {c}")
# d = 2949490604369332042543655342791890164406280368915772743180112248983081543377297997433483058840920536394600518903553366029576652759633125798786865976119260487351740713348199738642632291020152993019393231772448026157375511740766259794810214895233668481756469464194390124604593799200285564098993951714309460899545523300043946837236273797195498365387755774114034941257616292307877720774171156114381075577723338923498056595485936673078054579587831306191650680276261413737997870014491621145234557744694509979003815832819781382700602076056363346055838285508968491064489347313652638793895792823952193689434574654936220766297
# c = 7341514904325243305916366755307613619986720174511882742618551303299211072238639697355688848838982859381059673626965867644794262469199311451859830077675478638021664398672855820772016553080248041423126832931514496938745208445375736707260454313824171424826722901995363477583995161036193016481186294852709458404458333446221603984645259151587573114428427735277027309336406258617224201950976459091693631413605064109193995691234530306891893956176304835942233668136457174326113366635285808539981707926919705083327383166833588162140190182526036544634656531901891826093020929484545070080101135823892331472086063699539818563591


# 以下是第二段flag
m = bytes_to_long(flag2)
p = getPrime(512)
q = getPrime(512)
e = 3
n = p * q
assert m < n
c = pow(m, e, n)
print(f'c = {c}')
print(f'n = {n}')
# c = 574808471478635333245317783955856232370563895750738178995495491244722220578259862014622258456002771074212202993749856311345778504
# n = 132275218780270789276875142391448867650895270629670759900527027384204094378702805212980599389161642078516147410438758869570165283020546983219261613517162232406493853982513805637479563931664593533545755290425758761320070903155316315225168568823850902007487296420757650976479888059670760410374801967212927224977


# 以下是第三段flag
m = bytes_to_long(flag3)
p = getPrime(512)
q = getPrime(512)
n = p * p * q
e = 0x10001
d = inverse(e, p * (p-1) * (q-1))
assert m < n
c = pow(m, e, n)
hint = pow(d, e, n)
print(f'c = {c}')
print(f'hint = {hint}')
print(f'n = {n}')
# c = 95995020771266284668771773954095383926073034180948646028969032401939359632605448469918019304830962431504319950829514957438851980885420908331400633412921367641226567936331249173469086850004952349859327253487176970823999803143210342915194996505332578787985234930535548547834345641331406894553696409553432127676252530117997529863647389804169829603847371009965333521992075291993986519143392110820521102789536579717013822114100961105599532067858175576407477678474343
# hint = 331827959959669362980903675700579680333727515633777861628619061160155873334438387426601431102578757478220073973755314614841843834177072237961383958721650387302854513037804229759753543773380647137880844819226502619093178213699654143169541320688758073525229779021778299681565211604935016493932946601713080358152349008389888320122977378245126603180345245359431242722391116674672049868497727142316387043599105147729557199319037013456439001531544933422509782305382177
# n = 617084232354634109322171875468612900428229667931513848806770839434059627069484990725607996303673918867720768751727135179953407336155782580734284839136278190669702346600358059275099682118093888920038165877388324627028766987891732872124755908892972046287450095353992961045719531391795505441739616388353911919212662674941754442327213528963862921107314349391130370460483255191809581325731848910365215670220922837774417042794328874852028405333599359662323013152032901


# 以下是第四段flag
p = getPrime(160)
q = getPrime(160)
print(p)
print(q)
n = p * q
e = 65537
m = bytes_to_long(flag4)
d = inverse(e, (p-1) * (q-1))
c = pow(m, e, n)
print(f"d = {d}")
print(f"c = {c}")
# d = 242618035035163469434322293327938405750017912799190107714591368086742881522661519860077104080961
# c = 742481710491632202304950326079681148354035306250917295914498846416723687179474088162312486652622