import csv

haha = []
for i in range(0,7):
    temp = []
    for j in range(0,22):
        temp.append(0)
    haha.append(temp)
print haha
for i in range(1,54):
    infile = file("d"+str(i)+".csv",'rb')
    data = csv.reader(infile)
    n = 0
    for j in data:
        for d in range(len(j)):
            haha[n][d]+=int(j[d])
            #print haha[n][d]
        n+=1

print haha
outfile = file("d0.csv",'wb')
writer = csv.writer(outfile)
for i in haha:
    print i
    writer.writerow(i)
outfile.close()
