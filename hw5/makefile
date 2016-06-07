all: main

main: main.o EasyBMP.o
	g++ -o main main.o EasyBMP.o

main.o: main.cpp
	g++ -std=c++11 -o main.o -c main.cpp

EasyBMP.o: EasyBMP/EasyBMP.cpp
	g++ -o EasyBMP.o -c EasyBMP/EasyBMP.cpp

run:
	./main

clean:
	rm -rf main main.o EasyBMP.o
