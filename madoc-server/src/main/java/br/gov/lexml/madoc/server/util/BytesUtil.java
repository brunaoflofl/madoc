package br.gov.lexml.madoc.server.util;

import java.util.ArrayList;
import java.util.List;

public class BytesUtil {

	public static int indexOf(byte[] array, byte[] target) {
		return indexOf(array, 0, target);
	}

	public static int indexOf(byte[] array, int start, byte[] target) {
		
		if (target.length == 0) {
			return 0;
		}

		outer: for (int i = start; i < array.length - target.length + 1; i++) {
			for (int j = 0; j < target.length; j++) {
				if (array[i + j] != target[j]) {
					continue outer;
				}
			}
			return i;
		}
		return -1;
	}

	public static int lastIndexOf(byte[] array, byte[] target) {
		
		if (target.length == 0) {
			return 0;
		}

		outer: for (int i = array.length - target.length; i >= 0; i--) {
			for (int j = 0; j < target.length; j++) {
				if (array[i + j] != target[j]) {
					continue outer;
				}
			}
			return i;
		}
		return -1;
	}

	public static byte[] replace(byte[] array, byte[] oldBytes, byte[] newBytes) {

		List<Integer> indexes = new ArrayList<>();

		int s = 0;
		int i = 0;
		while(s <= (array.length - oldBytes.length)
				&& (i = BytesUtil.indexOf(array, s, oldBytes)) >= 0) {
			indexes.add(i);
			s += i + oldBytes.length;
		}

		if(indexes.size() == 0) {
			return array;
		}

		byte[] ret = new byte[array.length +
		   (newBytes.length - oldBytes.length) * indexes.size()];

		int srcPos = 0;
		int destPos = 0;
		int size;
		for(int e: indexes) {
			size = e - srcPos;
			System.arraycopy(array, srcPos, ret, destPos, size);
			destPos += size;
			System.arraycopy(newBytes, 0, ret, destPos, newBytes.length);
			srcPos += size + oldBytes.length;
			destPos += newBytes.length;
		}
		if(srcPos < array.length) {
			System.arraycopy(array, srcPos, ret, destPos, array.length - srcPos);
		}

		return ret;
	}
	
}
